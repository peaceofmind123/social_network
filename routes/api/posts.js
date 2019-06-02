// router file that handles requests to api/posts
// handles tasks such as creating, updating, liking, unliking posts

const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");

// import the models
const Post = require("../../models/Post");
const User = require("../../models/User");

// custom validation
const validatePostInput = require("../../validation/post");
// @route GET api/posts/test
// @desc  a test route
// @access PUBLIC
router.get("/test", (req, res) => res.json({ msg: "posts route works" }));

// @route POST api/posts
// @desc  Create a new post
// @access PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // validation
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    User.findById(req.user.id).then(user => {
      const newPost = new Post({
        text: req.body.text,
        user: user._id,
        name: user.name,
        avatar: user.avatar
      });
      newPost.save().then(post => res.json(post));
    });
  }
);

// @route GET api/posts
// @desc  Get all the posts available (of all users)
// @access PUBLIC
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 }) // sort by date, descending
    .then(posts => res.json(posts))
    .catch(() => res.status(404).json({ noposts: "No posts were found" }));
});

// @route GET api/posts/:id
// @desc  Get post by id
// @access PUBLIC
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(() =>
      res.status(404).json({ nopost: "The post with the id was not found" })
    );
});

// @route DELETE api/posts/:id
// @desc  Delete the post given by id
// @access PRIVATE
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          //verify if the user is trying to delete his/her own post and not anyone else's
          return res
            .status(401)
            .json({ noauth: "User is not authorized for this operation" });
        }
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(() =>
        res.status(404).json({ nopost: "The post with the id was not found" })
      );
  }
);
module.exports = router;
