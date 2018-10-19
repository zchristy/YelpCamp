var mongoose              = require('mongoose'),
    passportLocalMongoose = require("passport-local-mongoose");

// Schema Setup
var UserSchema = new mongoose.Schema({
   username: String,
   password: String
});

// Plugs in the passport local mongoose package allowing passport to authenticate the user
UserSchema.plugin(passportLocalMongoose);

// compile the Schema into a model and return with module.exports
module.exports = mongoose.model("User", UserSchema);