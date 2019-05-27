// router file that handles requests to api/profile
// handles tasks such as creating, viewing, updating, deleting profile of a user
// mostly will contain protected routes

const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load the models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load the validation logic
const validateProfileInput = require("../../validation/profile");

// @route GET api/profile/test
// @desc  a test route
// @access PUBLIC
router.get("/test", (req, res) => res.json({ msg: "profile route works" }));

// @route GET api/profile
// @desc  get the currently logged in user's profile, if it exists
// @access PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile doesn't exist for this user";
          return res.status(404).json(errors);
        }
        return res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/profile
// @desc  Create or update a profile
// @access PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // custom validation logic
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // This will be the object we will populate
    const profileFields = {};
    profileFields.user = req.user.id ? req.user.id : undefined;
    profileFields.handle = req.body.handle ? req.body.handle : undefined;
    profileFields.website = req.body.website ? req.body.website : undefined;
    profileFields.location = req.body.location ? req.body.location : undefined;
    profileFields.status = req.body.status ? req.body.status : undefined;
    profileFields.bio = req.body.bio ? req.body.bio : undefined;
    profileFields.githubusername = req.body.githubusername
      ? req.body.githubusername
      : undefined;
    profileFields.date = req.body.date ? req.body.date : undefined;

    // extract the skills array from a csv of skills provided from the frontend
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills
        .split(",")
        .map(skill => skill.trim());
    }

    // extract social
    profileFields.social = {}; //allocating memory
    profileFields.social.youtube = req.body.youtube
      ? req.body.youtube
      : undefined;
    profileFields.social.instagram = req.body.instagram
      ? req.body.instagram
      : undefined;
    profileFields.social.twitter = req.body.twitter
      ? req.body.twitter
      : undefined;
    profileFields.social.facebook = req.body.facebook
      ? req.body.facebook
      : undefined;
    profileFields.social.linkedin = req.body.linkedin
      ? req.body.linkedin
      : undefined;

    // the experience and education is not extracted here because we have
    // a seperate form and thus a seperate endpoint to add those

    // check to see if user already exists
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          // Update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, useFindAndModify: false }
          )
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json(err));
        } else {
          // Create new one

          // Check to see if the given handle already exists
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = "That handle already exists";
              return res.status(400).json(errors);
            }

            // no duplicates, so create new Profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile))
              .catch(err => res.status(400).json(err));
          });
        }
      })
      .catch(err => res.status(404).json(err));
  }
);
module.exports = router;
