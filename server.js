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
    //get search term from query string
    const searchTerm = req.query.search;

    res.sendFile(path.join(root, 'products.html'));
});

//serve cart page
app.get('/cart', (req, res) => {
    res.sendFile(path.join(root, 'cart.html'));
});

//serve user page
app.get('/user', (req, res) => {
    res.sendFile(path.join(root, 'user.html'));
});

app.post('/user/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(`Login attempt with username: ${username} and password: ${password}`);

    //check if username and password are in file
    fs.readFile('users.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(401).send('Invalid username or password');
            return;
        }
        let users = JSON.parse(data);
        let user = users.find(user => user.username === username && user.password === password);
        if (user) {
            //login successful
            res.send('login successful');
        } else {
            //login failed
            res.status(401).send('Invalid username or password');
        }
    });
});

app.post('/user/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(`Register attempt with username: ${username} and password: ${password}`);
    
    //if username and password are empty send error
    if (!username || !password) {
        res.send('Username and password cannot be empty');
        return;
    }
    //if username already exists send error

    //register user
    const user = {
        username: username,
        password: password
    };

    //save user to file
    fs.readFile('users.json', (err, data) => {
        let users = [];
        if (err) {
            console.error(err);
        } else {
            //check if file contains user already
            users = JSON.parse(data);
            let existingUser = users.find(user => user.username === username);
            if (existingUser) {
                res.status(400).send('Username already exists');
                return;
            }
        }
        users.push(user);
        console.log(users);
        fs.writeFile('users.json', JSON.stringify(users), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error creating users file');
                return;
            }
            res.send('registration successful');
        });
    });
    
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

