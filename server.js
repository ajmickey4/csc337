/*
    Task: Develop a website that will be similar to a real-life scenario.
    Scope: At least three modules for their website (one per member).
        - In most cases there will be a user module. You will have to figure out the two other modules. For example, if you want to build a website on some form of e-commerce, then products and sponsors might be considered two other modules. You also have to take care of session management, which you learned in the class. Another important aspect is file management or databases. We have already started file management in class. You will also know about database management (if not yet, then soon).
    Example ideas:
        - management website you have seen in class 
        - some type of e-comm store, like the guitar website you have designed in an early assignment
        - Any of your favorite website(s)!

I will be creating a simple e-comm store where people can buy and sell homemade goods. I will be using the following modules:
    - User module
    - Product module
    - Order module
    - Cart module
*/
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'public'); //for submitting reasons leave everything in same folder
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // middleware to parse URL-encoded bodies

const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/"; // MongoDB connection string
const client = new MongoClient(uri);

//add crypto module for password hashing
const crypto = require('crypto');

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Middleware to serve static files
app.use(express.static(root));

//serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(root, 'index.html'));
});

//serve shopping page
app.get('/products', (req, res) => {
    res.sendFile(path.join(root, 'products.html'));
});

//retrieve products from database
app.post('/products/get-items', (req, res) => {
    let search = req.body.search;

    console.log(`Search term: ${search}`);
    getProducts(search).then(products => {
        res.json(products);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving products');
    });
});

async function getProducts(searchTerm) {
    try {
        await client.connect();
        const database = client.db('mickeyShop');
        const collection = database.collection('products');
        let query = {};
        //search for tags first, then name, then description
        if (searchTerm) {
            query = {
                $or: [
                    { tags: { $regex: searchTerm, $options: 'i' } },
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }
        const products = await collection.find(query).toArray();
        return products;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

//serve cart page
app.get('/cart', (req, res) => {
    res.sendFile(path.join(root, 'cart.html'));
});

//serve user page
app.get('/user', (req, res) => {
    res.sendFile(path.join(root, 'user.html'));
});

// ...

app.post('/user/login', async (req, res) => {
    const username = req.body.username;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    console.log(`Login attempt with username: ${username} and password: ${password}`);

    try {
        // Connect to the MongoDB database
        await client.connect();

        // Access the users collection
        const usersCollection = client.db('mickeyShop').collection('users');

        // Find the user with the given username and password
        const user = await usersCollection.findOne({ username: username, password: password });
        console.log('user found', user);
        if (user) {
            // Login successful, send response with user ID
            res.send(user._id.toString()); // Send the user ID as response
        } else {
            // Login failed
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    } finally {
        await client.close();
    }
});

// ...

app.post('/user/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(`Register attempt with username: ${username} and password: ${password}`);

    // if username and password are empty send error
    if (!username || !password) {
        res.send('Username and password cannot be empty');
        return;
    }

    try {
        // Connect to the MongoDB database
        await client.connect();

        // Access the users collection
        const usersCollection = client.db().collection('users');

        // Check if the username already exists
        const existingUser = await usersCollection.findOne({ username: username });
        if (existingUser) {
            res.status(400).send('Username already exists');
            return;
        }

        // Hash the password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create a new user object
        const newUser = {
            username: username,
            password: hashedPassword
        };

        // Insert the new user into the database and get the inserted ID
        const result = await usersCollection.insertOne(newUser);
        const insertedId = result.insertedId;

        res.send(insertedId.toString()); // Send the inserted user ID as response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating user');
    } finally {
        // Close the database connection
        await client.close();
    }
});

app.post('/cart/:action', async (req, res) => {
    // Extract parameters from the request
    const action = req.params.action; // 'add' or 'remove'

    //get userId, productId, and quantity from request body
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1; // Default to 1 if not provided

    console.log(`Action: ${action}, User ID: ${userId}, Product ID: ${productId}, Quantity: ${quantity}`);
});


//serve stylesheets
app.get('/styles/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(root, 'styles', file);
    try {
        res.sendFile(filePath);
    } catch (err) {
        console.error(err);
        res.status(404).send('File not found');
    }
});

//serve scripts
app.get('/js/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(root, 'js', file);
    try{
        res.sendFile(filePath);
    }
    catch (err) {
        console.error(err);
        res.status(404).send('File not found');
    }
});





//start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//add data to database
async function addDataToDatabase() {
    try {
        await client.connect();
        const database = client.db('mickeyShop');
        const collection = database.collection('products');

        // Sample product data from handmade_products.json
        //open file
        const data = fs.readFileSync('handmade_products.json', 'utf8');
        const products = JSON.parse(data);


        // Insert sample products into the collection
        const result = await collection.insertMany(products);
        console.log(`${result.insertedCount} products were inserted`);

        //insert users from users.json
        const usersData = fs.readFileSync('users.json', 'utf8');
        const users = JSON.parse(usersData);
        const usersCollection = database.collection('users');
        const usersResult = await usersCollection.insertMany(users);
        console.log(`${usersResult.insertedCount} users were inserted`);

        
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

//addDataToDatabase();
