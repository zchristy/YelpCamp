// ========================================================================
// PACKAGE/SCHEMA SETUP - Requiring & Calling JSON packages and Asset files
// ========================================================================
var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment");

// ===========================================================
// MIDDLEWARE
// ===========================================================
var middleware = require("../middleware");

// ===========================================================
//                    COMMENTS ROUTES
// ===========================================================
// ===========================================================
//      NEW - show form to create new Comment Object in DB
// ===========================================================
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err || !campground){
           req.flash("error", "Comment not found");
           console.log(err);
           res.redirect("back");
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
    
});

// ===========================================================
//           CREATE - adds new Comment Object to DB
// ===========================================================
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if(err || !campground){
           req.flash("error", "Campground not found");
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           // Create a new comment and save to DB    
            Comment.create(req.body.comment, function(err, comment){
                if(err || !comment){
                    req.flash("error", "ERROR: Your Comment could not be created.");
                    console.log(err);
                } else {
                    // add username, id, and avatar to comment
                    comment.author.id       = req.user._id;
                    comment.author.avatar   = req.user.avatar;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // // redirect campground show page
                    req.flash("success", "Your Comment has been Posted!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
       }
    });
    
    // get data from form and add to comment array (****THIS WAS REPLACED WITH req.body.comment****)
    // var text   = req.params.id.comments.text,
    //     author = req.params.id.comments.text;
        
    // var newComment = {text: text, author: author};
    
});

// =====================================================================
//          EDIT - find Object to edit send to a edit form
// =====================================================================
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                req.flash("error", "Campground not found.");
                console.log(err);
                res.redirect("back");
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
                } 
        });
    });
 });

// =====================================================================
//      UPDATE - find & update Object then redirect to rootPage/:id
// =====================================================================
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
      if(err || !updateComment){
        req.flash("error", "Comment not found.");
        res.redirect("back");
        console.log(err);
      } else {
          req.flash("success", "Your Comment has been Edited!");
          res.redirect("/campgrounds/" + req.params.id);
      }
  }); 
});

// =====================================================================
//     DESTROY - find & Destroy Object then redirect to rootPage/:id
// =====================================================================
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // destroy campground using mongoose
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
        req.flash("error", "Campground not found.");
        res.redirect("back");
        console.log(err);
      } else {
          req.flash("success", "Your Comment has been successfully deleted!");
          // redirect somewhere
          res.redirect("/campgrounds/" + req.params.id);
      }
  }); 
    
});

// =======================================================
//                    EXPORT FILE
// =======================================================
module.exports = router;