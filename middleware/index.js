// ===========================================================
// SCHEMA SETUP - used to structure objects to and from the DB
//              - require models from a module.exports js file
// ===========================================================
var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

// =================================================================
//                           MIDDLEWARE
// =================================================================
var middlewareObj = {};

// ======================================================================================
// checkCampgroundOwnership Function - used as a middleware to check campground ownership
// ======================================================================================

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()){
        // does user own the campground?
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
              req.flash("error", "Campground not found");
              console.log(err);
              res.redirect("back");
          } else {
            //   does user own the campground? using mongoose method to find if the compare
            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else {
                req.flash("error", "You done have permision!");
                res.redirect("back");
            }
              
          }
  });
  }else {
      req.flash("error", "Please Login First!");
      res.redirect("back");
  }
};

// ======================================================================================
// checkCampgroundOwnership Function - used as a middleware to check campground ownership
// ======================================================================================

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
              req.flash("error", "Comment not found");
              console.log(err);
              res.redirect("back");
            } else {
            
            // does user own the campground?
            // this is a mongoose id, so === does not work here, we have to use
            // the method equals() provided by mongoose
            // req.user._id can be used thanks to passport
            if(foundComment.author.id.equals(req.user._id)|| req.user.isAdmin){
                next();
            } else {
                req.flash("error", "You dont have permission!");
                res.redirect("back");
                }
              
            }
        });
    }else {
      req.flash("error", "Please Login First!");
      res.redirect("back");
  }
};

// =========================================================================
// isLoggedIn Function - used as a middleware to make sure user is logged in
// =========================================================================

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    } 
};

// =======================================================
//                  EXPORT FILE
// =======================================================
module.exports = middlewareObj;