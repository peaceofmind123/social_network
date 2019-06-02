const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // the id of the user who made this post
  user: {
    type: Schema.Types.ObjectId,
    ref: "user" // this could be either user: the model name or users: the collection name
  },

  text: {
    type: String,
    required: true
  },
  // name and avatar are repeated here cuz we need them even if the user is deleted
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      // The name and avatar of the user who has made the comment
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

// in this one, I manually added the collection name, which is optional
module.exports = Post = mongoose.model("post", PostSchema, "posts");
