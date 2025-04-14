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

// Middleware to serve static files
app.use(express.static(root));


app.get('/', (req, res) => {
    res.sendFile(path.join(root, 'index.html'));
});

//serve stylesheets
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(root, 'styles.css'));
});





//start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

