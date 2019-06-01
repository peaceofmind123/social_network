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
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

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
      .populate("user", ["name", "avatar"]) // add name and avatar fields from the user model
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

// @route GET api/profile/handle/:handle
// @desc  Get profile by handle
// @access PUBLIC
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this handle";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = "There is no profile for this handle";
      res.status(404).json(errors);
    });
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user id
// @access PUBLIC
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    });
});

// @route GET api/profile/all
// @desc  Get all profiles
// @access PUBLIC
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      console.log(err);
      errors.noprofile = "There are no profiles";
      res.json(errors);
    });
});

// @route POST api/profile/experience
// @desc  Add experience to profile
// @access PRIVATE
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // custom validation logic
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Get the profile of the currently logged in user
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
          };
          // add the new experience
          profile.experience.unshift(newExp);
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json(err));
        } else {
          errors.noprofile = "Profile doesn't exist for this user";
          return res.status(404).json(errors);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/profile/education
// @desc  Add education to profile
// @access PRIVATE
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // custom validation logic
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Get the profile of the currently logged in user
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          const newEdu = {
            school: req.body.school,
            fieldofstudy: req.body.fieldofstudy,
            degree: req.body.degree,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
          };
          // add the new education
          profile.education.unshift(newEdu);
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json(err));
        } else {
          errors.noprofile = "Profile doesn't exist for this user";
          return res.status(404).json(errors);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc  Delete experience by id
// @access PRIVATE
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get the index of the experience to delete
        const toDeleteIndex = profile.experience
          .map(item => item._id.toString())
          .indexOf(req.params.exp_id);

        // remove experience if exists
        if (toDeleteIndex >= 0) {
          profile.experience.splice(toDeleteIndex, 1);
        } else {
          return res
            .status(404)
            .json({ notfound: "The experience is not found" });
        }

        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc  Delete education
// @access PRIVATE
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get the index of the education to delete
        const toDeleteIndex = profile.education
          .map(item => item._id.toString())
          .indexOf(req.params.edu_id);

        // remove the education if exists

        if (toDeleteIndex >= 0) {
          profile.education.splice(toDeleteIndex, 1);
        } else {
          return res
            .status(404)
            .json({ notfound: "The education is not found" });
        }
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route DELETE api/profile
// @desc  Delete the user's profile
// @access PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    Profile.findOneAndDelete({ user: req.user.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => res.status(404).json({ success: false }));
  }
);

module.exports = router;
