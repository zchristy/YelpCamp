// =================================================================
// PACKAGE SETUP - Requiring & Calling JSON packages and Asset files
// =================================================================
// dotENV package
require('dotenv').config();

var express               = require('express'),
    app                   = express(),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    flash                 = require('connect-flash'),
    seedDB                = require("./seeds"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose");


// ===========================================================
// SCHEMA SETUP - used to structure objects to and from the DB
//              - require models from a module.exports js file
// ===========================================================
var Comment    = require('./models/comment'),
    User       = require('./models/user'),
    Campground = require('./models/campground');
    
// =================================================================
// ROUTE SETUP - Requiring & Calling routes from the route js file
// =================================================================
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    userRoutes       = require("./routes/users"),
    indexRoutes      = require("./routes/index");

// ===========================================================
//                  MONGOOSE CONFIGURATION
// ===========================================================
// getting-started.js with mongoose.... connecting mongo data base
// this is an Enviroment variable
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp';
// mongoose.connect('mongodb://localhost:27017/yelp_camp');
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect('mongodb://<insert username here>:<insert password here>@ds135993.mlab.com:35993/zc_yelp_camp');
// added this to config var in Heroku settings
// (export ENVIRMONTVARIABLE = "KEY") is used to set private information out of sight


// ===========================================================
//                  BODY-PARSER CONFIGURATION
// ===========================================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// ===========================================================
//                  EJS CONFIGURATION
// ===========================================================
// to assume .ejs on the end of file names
app.set("view engine", "ejs");

// ===========================================================
//                  PUBLIC DIRECTORY CONFIGURATION
// ===========================================================
// Call the public directory for the Assets
app.use(express.static(__dirname + "/public"));

// ===========================================================
//                  METHOD-OVERRIDE CONFIGURATION
// ===========================================================
// use the method override package and look for _method
// this is used to over ride the POST method with a PUT or DELETE method
app.use(methodOverride("_method"));

// ===========================================================
//                  CONNECT-FLASH CONFIGURATION
// ===========================================================
// use the method override package and look for _method
// this is used to over ride the POST method with a PUT or DELETE method
app.use(flash());

// ===========================================================
//                  CUSTOM JS FILE CONFIGURATION
// ===========================================================
// Call the function in seeds.js to seed the DB
// seedDB();

// ==================================================================
// Moment.js - package Config, Now moment is available for use in 
// all of your view files via the variable named moment
// ==================================================================
app.locals.moment = require('moment');

// ===========================================================
//                  PASSPORT CONFIGURATION
// ===========================================================
// this is to use express session (this is needed for passport)
app.use(require("express-session")({
    secret: "Baseball is awesome",
    resave: false,
    saveUninitialized: false
}));

// this is to use passport (the methods come from passport-local-mongoose)
app.use(passport.initialize());
app.use(passport.session());

// you need these two line any time you want to run passport 
// (the methods come from passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));

// Reads the session and taking the data from the session thats encoded and unencode it, 
// then does the opposite (the methods come from passport-local-mongoose)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==================================================================
// GLOBAL ROUTE VARIABLES
// ==================================================================
app.use(function(req, res, next){
    // currentUser - used to pass (currentUser) to each ejs file
   res.locals.currentUser = req.user;
   // Flash Message - used to pass (message) to each ejs file
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   // this is to move to next execution 
   next();
});

// ==================================================================
//                      ROUTE CONFIGURATION
//  This configuration is an additive to the Route Setup from above
//  here we are using the route setups as well as adding a constant 
//  path to campgroundRoutes and commentRoutes so we dont have to 
//  write "/campgrounds" or "/campgrounds/:id/comments"in every 
//  .get/.post route
// ==================================================================
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/users/:id", userRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// ===========================================================
// STAGING AREA - where we populate the DB for tests
// Only used in the beginning of build....
// ===========================================================

// Campground.create(
//     {
//     name: "Banks Lake", 
//     image: "https://farm8.staticflickr.com/7534/16208186152_33fe538e22_h.jpg",
//     description: "This is a beautiful open campground, with lovely morning sunrises"
//     },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Campground added to DB");
//             console.log(campground);
//         }
//     }
// );

// ===========================================================
//                    STARTING THE SERVER
// ===========================================================

// Start the server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Your App has started");  
});