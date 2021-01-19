//Setting up express abd body parser
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const validatorMiddleware = require('./helpers/validations/expressValidator');
const routes = require('./routes/routes.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Database setup
require('./models/db.js');
require('./config/passport')(passport);
const flash = require('connect-flash');
//Setting up routes to be used


const morgan = require('morgan');
const session = require('express-session');

//declaring port number
const PORT = process.env.PORT || 3000;
//allows access to public folder (CSS,images,JS,etc)
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(validatorMiddleware());



app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());
//pass authetication to every view/used to dynamically render navbar
app.use(function(req, res, next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

//Set the view engine
app.set('view engine', 'pug');
//using flash to displaying error message
app.use(flash());
app.use('/', routes);

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error);
});

//develop purpose
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


// Starting the server with port # 3000
app.listen(PORT,function(){
    console.log(`Express listening on port ${PORT}`);
});