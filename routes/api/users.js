// router file that handles requests to api/users
// handles tasks such as login, logout, signup and authentication of users
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = require("../../config/keys").secretKey;
const passport = require("passport");
const registrationValidator = require("../../validation/register");

// @route GET api/users/test
// @desc  a test route
// @access PUBLIC
router.get("/test", (req, res) => res.json({ msg: "users route works" }));

// @route POST api/users/register
// @desc  register a new user
// @access PUBLIC
router.post("/register", async (req, res) => {
  const { errors, isValid } = registrationValidator(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    // check if email is already registered
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser) {
      errors.email = "Email is already registered";
      return res.status(400).json(errors);
    }

    // if email is not registered yet
    const avatar = gravatar.url(req.body.email, {
      s: "200", // size
      r: "r", // rating
      d: "mm" // default case: mm stands for return placeholder image
    });

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar
    });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    newUser.password = hash;
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.log(err);
  }
});

// @route POST api/users/login
// @desc  login a user / generate a JWT
// @access PUBLIC
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find the user with the email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ email: "User not found" });
  }

  // verify the password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ password: "Password is incorrect" });
  }

  // create payload
  const payload = { avatar: user.avatar, name: user.name, id: user._id };

  // generate JWT
  jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
    return res.json({ success: true, token: `Bearer ${token}` });
  });
});

// @route POST api/users/current
// @desc  get current user
// @access PRIVATE
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = router;
