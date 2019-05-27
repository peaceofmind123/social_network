const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// The profile schema
const ProfileSchema = new Schema({
  user: {
    // ref to the user this profile belongs to
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  handle: {
    // the endpoint of the user in the website (eg. www.mysite.com/profile/ashishthesatan) then, ashishthesatan is the handle
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    // The level of experience
    // This will be a select in the frontend so, required
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    //needed to pull in latest 5 repos if they choose to provide this info
    type: String
  },
  experience: [
    // a man can have multiple experiences, so
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        //denotes if this work is currently going on
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    // the schools one has attended
    {
      school: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    // just an object cuz not many values, just can be accessed by keys
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    },
    facebook: {
      type: String
    },
    youtube: {
      type: String
    }
  },
  date: {
    // the date of latest update of the profile
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
