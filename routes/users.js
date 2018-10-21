// ========================================================================
// PACKAGE/SCHEMA SETUP - Requiring & Calling JSON packages and Asset files
// ========================================================================
var express      = require("express"),
    router       = express.Router({mergeParams: true}),
    passport     = require("passport"),
    User         = require("../models/user"),
    Comment      = require("../models/comment"),
    Campground   = require("../models/campground");
    
// ===========================================================
// MIDDLEWARE
// ===========================================================
var middleware = require("../middleware");

// ===========================================================
//                    USER PROFILE -Index
// ===========================================================
router.get("", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
     if(err || !foundUser){
         req.flash("error", "Something Went Wrong");
         res.redirect("back");
     } 
     Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
        if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("back");
        }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
     });
   });
});

// ===========================================================
//                    USER PROFILE - edit
// ===========================================================
router.get("/edit", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
     if(err || !foundUser){
         req.flash("error", "Something Went Wrong");
         res.redirect("back");
     } else {
         res.render("users/edit", {user: foundUser});
     }
   });
});

// =====================================================================
//                   USER PROFILE - Update
// =====================================================================
router.put("", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
        if(err || !user){
            req.flash("error", "Something went wrong!");
            res.redirect("/users/"+ req.user._id +"/edit");
            console.log(err);
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/users/"+ req.user._id);
        }
    });
});





















// // =====================================================================
// //      UPDATE - find & update Object then redirect to rootPage/:id
// // =====================================================================
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     geocoder.geocode(req.body.location, function (err, data) {
//         if (err || !data.length) {
//             console.log(data);
//             console.log(err);
//             req.flash('error', 'Invalid address');
//             return res.redirect('back');
//         }
//         req.body.campground.lat = data[0].latitude;
//         req.body.campground.lng = data[0].longitude;
//         req.body.campground.location = data[0].formattedAddress;
    
//         Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
//             if(err || !campground){
//                 req.flash("error", "Campground not found");
//                 res.redirect("/campgrounds");
//                 console.log(err);
//             } else {
//                 req.flash("success", "Successfully Updated!");
//                 res.redirect("/campgrounds/" + req.params.id);
//             }
//         });
//     });
// });

// // =====================================================================
// //     DESTROY - find & update Object then redirect to rootPage/:id
// // =====================================================================
// router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     // destroy campground using mongoose
//     Campground.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//         req.flash("error", "Campground not found");
//         res.redirect("/campgrounds");
//         console.log(err);
//       } else {
//           req.flash("success", "Your Campground has been successfully deleted!");
//           // redirect somewhere
//           res.redirect("/campgrounds");
//       }
//   }); 
    
// });

// =======================================================
//                  EXPORT FILE
// =======================================================
module.exports = router;