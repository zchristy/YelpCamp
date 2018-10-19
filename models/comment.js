var mongoose   = require('mongoose');

// Schema Setup
var commentSchema = new mongoose.Schema({
   text: String,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

// compile the Schema into a model and return with module.exports
module.exports = mongoose.model("Comment", commentSchema);