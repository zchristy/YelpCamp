// ========================================================================
// PACKAGE/SCHEMA SETUP - Requiring & Calling JSON packages and Asset files
// ========================================================================
var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground"),
    async      = require("async"),
    nodemailer = require("nodemailer"),
    crypto     = require("crypto");

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
             res.redirect("/users/" + req.user._id);
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

// ===========================================================
//                       FORGOT PASSWORD
// ===========================================================
// Display the forgot password page
router.get("/forgot", function(req, res){
   res.render("forgot"); 
});

// submit and handle user forgot password with token
router.post("/forgot", function(req, res, next){
    // async.waterfall allows us to fire off functions one after another
    async.waterfall([
        function(done) {
            // generate a random token to be used to verify user
            crypto.randomBytes(20, function(err, buf){
               var token = buf.toString('hex');
               done(err, token);
            });
        },
        // find user by email, Add a token and expiration time to user object
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                } else if (err) {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('forgot');
                }
            //   these two variables need to be added to user model
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
              
              user.save(function(err){
                 done(err, token, user); 
              });
          });
        },
        // Send reset password email
        function(token, user, done) {
            // config mailer
            var smtpTransport = nodemailer.createTransport({
            service: "Gmail", 
               auth: {
                   user: process.env.GMAILUS,
                   pass: process.env.GMAILPW
               }
            });
            // config mailer options
            var mailOptions = {
                from: process.env.GMAILUS,
                to: user.email,
                subject: 'Node.js Password Reset',
                text: 'You are recieving this email, because you (or someone else) have requested the reset of the password for your account. \n\n' +
                'Please click on the following link, or paste this into your browser to complete to process: \n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request a password reset, Please ignore this email and your password will remain unchanged. \n'
            };
            // send email with configs
            smtpTransport.sendMail(mailOptions, function(err, info){
               console.log('mail sent');
               req.flash('success', 'An Email has been sent to ' + user.email + 'with further instructions.');
               done(err, 'done');
            });
        }
    ], function(err) {
        if(err){
            return next(err);
        }
        res.redirect('/forgot');
    }); 
});
router.get('/reset/:token', function(req, res){
   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, user){
      if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot');
      } else if (err) {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('forgot');
        }
      res.render('reset', {token: req.params.token});
   }); 
});
router.post('/reset/:token', function(req, res){
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
               if(!user){
                   req.flash('error', 'Password reset token is invalid or has expired');
                   return res.redirect('back');
               }
               if (err) {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('back');
                }
                
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        if (err) {
                            req.flash('error', 'Something went wrong');
                            return res.redirect('back');
                        }
                      user.resetPasswordToken = undefined;
                      user.resetPasswordToken = undefined;
                      
                      user.save(function(err) {
                          if (err) {
                            req.flash('error', 'Something went wrong');
                            return res.redirect('back');
                          }
                          req.logIn(user, function(err) {
                             done(err, user); 
                         }); 
                      });
                   });
               } else {
                   req.flash('error', 'Passwords do not match.');
                   return res.redirect('back');
               }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail", 
                auth: {
                    user: process.env.GMAILUS,
                    pass: process.env.GMAILPW
               }
            });
            var mailOptions = {
                from: process.env.GMAILUS,
                to: user.email,
                subject: 'Your password has been changed',
                text: 'Hello, \n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
               req.flash('success', 'Success! Your password has been changed.');
               done(err);
            });
        }
    ], function(err) {
        if (err) {
            req.flash('error', 'Something went wrong');
            return res.redirect('back');
        }
        res.redirect('/campgrounds');
    }); 
});




// =======================================================
//                  EXPORT FILE
// =======================================================
module.exports = router;