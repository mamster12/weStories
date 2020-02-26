const express = require('express');
const exphbs = require('express-handlebars');
const path    = require('path');

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const app = express();

// //require user model
// require('./models/User');

//load config
require('./config/passport')(passport);

//load keys
const keys = require('./config/keys');
//Map global promises


//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

mongoose.Promise = global.Promise;
//Mongoose Connect
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('mongodb connected'))
.catch(err => console.log(err));

//handleBars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

//passport middelware
app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//use the routes
app.use('/', index);
app.use('/auth', auth);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});