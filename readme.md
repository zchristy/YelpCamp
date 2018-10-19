RESTful Routes

name          url               verb         description                                               Mongoose Method
=====================================================================================================================================
INDEX   |   /dogs           |   GET     |    Display a list of all daogs                          |       Dog.find()
NEW     |   /dogs/new       |   GET     |    Display form to make a new dogs                      |       N/A
CREATE  |   /dogs           |   POST    |    Add new dog to DB                                    |       Dog.create()
SHOW    |   /dogs/:id       |   GET     |    shows info about one dog                             |       Dog.findById()
EDIT    |   /dogs/:id/edit  |   GET     |    Show edit form for one dog                           |       Dog.findById()
UPDATE  |   /dogs/:id       |   PUT     |    Update a particular dog, then redirect somewhere     |       Dog.findByIdAndUpdate()
DESTROY |   /dogs/:id       |   DELETE  |    Delete a particular dog, then redirect somewhere     |       Dog.findByIdAndRemove()

#YelpCamp

* add landing page
* add campgrounds page that lists all campgrounds

Each Campground has:
* Name
* Image

#layout and basic styling
* create our header and footer partials
* add in bootstrap

#creating new campgrounds
* setup new campground POST route
* add in body-parser
* setup route to show form
* add basic unstyled form

#Style the Campgrounds Page
* Add a better header/title
* Make campgrounds display in a grid
* 
#Style the Navbar and Form
* Add a navbar to all templates
* Style the new campground form

#Add Mongoose
* Install and Configure mongoose
* Setup campground model
* Use campground model inside of our routes

#Show Page
* Review the RESTful routes we've seen so far
* add description to our campground model
* show db.collection.drop()
* add a show route/template

#Refactor Mongoose Code
* Create a models directory
* User module.exports
* Require everything correctly

#Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts

#Add the Comment Model
* Make our errors go away!
* Display comments on campground show page

#Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

INDEX      /campgrounds
NEW        /campgrounds/new
CREATE     /campgrounds
SHOW       /campgrounds/:id

<!--Nested Routes-->
NEW        /campgrounds/:id/comments/new      GET
CREATE     /campgrounds/:id/comments          POST

#Style Show Page
* Add sidebar to show page
* Display comments Nicely

##Finish Styling Show Page
* Add public directory
* Add Custom Stylesheet

##Auth pt. 1 - Add User Model
* Install all packages needed for auth
* Define User model

##Auth pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

##Auth pt. 3 - Login
* Add Login Routes
* Add login template

##Auth pt. 4 - Logout/Navbar
* Add Logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar

##Auth pt. 5 - show/hide Links
* Show/hide auth links in navbar correctly

##Refactor the Routes
* Use Express Router to reorganize all routes

##Users + Comments
* Associate users and comments
* Save author's name to a comment automatically

##Users + Campgrounds
* Prevent an unauthenticated user from creating a campground
* Save username + id to newly created campground

##Editing Campgrounds
* Add Method-Override
* Add edit Route for campgrounds
* Add Link to Edit Page
* Add update Route
* Fix $set problem

#Deleting Campgrounds
* Add Destroy Route
* Add Delete Button

#Authorization pt. 1: Campgrounds
* User can only edit his/her campgrounds
* User can only delete his/her campgrounds
* Hide/Show edit and delete buttons

#Editing Comments
* Add Edit route for comments
* Add Edit buttons
* Add Update route

#Deleting Comments
* Add Destroy Route
* Add Delete Button

#Authorization pt. 2: Comments
* User can only edit his/her comments
* User can only delete his/her comments
* Hide/show edit and delete buttons
* refactor Middleware

#Adding in Flash!
* Demo working version
* Install and configure connect-flash
* Add bootstrap alerts to header