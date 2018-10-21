// ========================================================================
// PACKAGE/SCHEMA SETUP - Requiring & Calling JSON packages and Asset files
// ========================================================================
var express      = require("express"),
    router       = express.Router(),
    User         = require("../models/user")
    Campground   = require("../models/campground"),
    NodeGeocoder = require('node-geocoder');
    
// ===========================================================
// MIDDLEWARE
// ===========================================================
var middleware = require("../middleware");

// ===========================================================
// GEOCODER -Config
// ===========================================================
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
var geocoder = NodeGeocoder(options);

// ===========================================================
//                    Campgrounds Routes
// ===========================================================
// INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB 
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// ===========================================================
//       NEW - show form to create new Object in DB
// ===========================================================
// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// ===========================================================
//             CREATE - adds new Object to DB
// ===========================================================
// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campground array
    var name  = req.body.name,
        price = req.body.price,
        image = req.body.image,
        desc  = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        };
    geocoder.geocode(req.body.location, function(err, data){
        if (err || !data.length) {
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = {name: name, price: price, image: image, description: desc, location: location, lat: lat, lng: lng, author: author};
    
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              req.flash("error", "ERROR: Your Campground could not be created.");
              console.log(err);
          } else {
                req.flash("success", "Your Campground has been Posted!");
                // redirect back to campgrounds page
                res.redirect("/campgrounds");
          }
        });
        // campgrounds.push(newCampground); (v1 code)
    }); 
});

// =====================================================================
// SHOW - show additional information about one Object (ex: a blog post)
// =====================================================================
// SHOW - show additional information about one campground
router.get("/:id", function(req, res){
    // find the campgorund with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            // render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// =====================================================================
//          EDIT - find Object to edit send to a edit form
// =====================================================================
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
            } 
    });
 });

// =====================================================================
//      UPDATE - find & update Object then redirect to rootPage/:id
// =====================================================================
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(data);
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
            if(err || !campground){
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
                console.log(err);
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// =====================================================================
//     DESTROY - find & update Object then redirect to rootPage/:id
// =====================================================================
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // destroy campground using mongoose
    Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
        console.log(err);
      } else {
          req.flash("success", "Your Campground has been successfully deleted!");
          // redirect somewhere
          res.redirect("/campgrounds");
      }
  }); 
    
});

// =======================================================
//                  EXPORT FILE
// =======================================================
module.exports = router;