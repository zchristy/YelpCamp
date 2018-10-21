// ========================================================================
// PACKAGE/SCHEMA SETUP - Requiring & Calling JSON packages and Asset files
// ========================================================================
var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground");

// ===========================================================
//                INDEX - Home Page - Root Page
// ===========================================================
router.get("/", function(req, res){
   res.render("landing");
});

// ===========================================================
//                      AUTH ROUTES
// ===========================================================

// ===========================================================
//                    REGISTER/SIGNUP
// ===========================================================
// register route - show sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

// handling user sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username:  req.body.username,
        firstName: req.body.firstName,
        lastName:  req.body.lastName,
        email:     req.body.email,
        avatar:    req.body.avatar 
    });
    if(req.body.adminCode == process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    // put a new User with req.body.username as a value in the db
    User.register(newUser, req.body.password, function(err, user){
       if(err || !user){
        //   req.flash("error", err.message);
          console.log(err);
          return res.render('register', {error: err.message});
      } else {
        //   authenticate with a local strategy NOTE: local can be changed to facebook
        // if facebook is the authentication strategy being used
          passport.authenticate("local")(req, res, function(){
             req.flash("success",  "Welcome to Yelp Camp " + user.username[0].toUpperCase() + user.username.substring(1));
             res.redirect("/user/:id");
          });
      }
   });
});

// ===========================================================
//                            LOGIN
// ===========================================================
// LOGIN route - show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic - app.post("/login", middleware, callback) 
// the authenticate() method was setup with - 
// passport.use(new LocalStrategy(User.authenticate())); in the passport configuration
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    
});

// ===========================================================
//                            LOGOUT
// ===========================================================
router.get("/logout", function (req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



// =======================================================
//                  EXPORT FILE
// =======================================================
module.exports = router;