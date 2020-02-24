const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//load router
const auth = require('./routes/auth');

//load config
require('./config/passport')(passport);

const app = express();

app.get('/', (req, res) => {
    res.send('HomePage');
});

//use the routes
app.use('/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});