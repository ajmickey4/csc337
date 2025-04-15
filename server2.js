const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const root = path.join(__dirname, 'public');

app.use((req, res, next) => {
    console.log(`→ ${req.method} ${req.url}`);
    next();
});

app.get('/user', (req, res) => {
    console.log('🟢 /user route hit');
    res.send('This is the user page');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});