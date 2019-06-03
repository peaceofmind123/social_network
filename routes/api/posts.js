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

// @route POST api/posts/like:id
// @desc  Like the post given by id
// @access PRIVATE
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if the user already liked the post
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "The user already liked this post" });
        }

        post.likes.unshift({ user: req.user.id });
        post.save().then(post => res.json(post));
      })
      .catch(() => res.status(404).json({ nopost: "the post does not exist" }));
  }
);

// @route POST api/posts/unlike/:id
// @desc  Unlike the post given by id
// @access PRIVATE
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if the user has liked the post
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          // he/she has not liked it yet
          return res
            .status(400)
            .json({ notliked: "The user has not liked this post" });
        }

        const removeIndex = post.likes
          .map(like => like.user.toString())
          .indexOf(req.user.id);

        if (removeIndex >= 0) {
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        }
      })
      .catch(() => res.status(404).json({ nopost: "the post does not exist" }));
  }
);

// @route POST api/posts/comment/:id
// @desc  Comment on the post given by id
// @access PRIVATE
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Validation logic
    const { errors, isValid } = validatePostInput(req.body); //since comment is essentially a post
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // find the post to comment
    Post.findById(req.params.id)
      .then(post => {
        // get the logged in user's name and avatar
        User.findById(req.user.id).then(user => {
          const newComment = {
            text: req.body.text,
            user: req.user.id,
            name: user.name,
            avatar: user.avatar
          };

          // add the comment to the comments array
          post.comments.unshift(newComment);
          post.save().then(post => res.json(post));
        });
      })
      .catch(() => res.status(404).json({ nopost: "Post not found" }));
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc  Delete the comment on the post
// @access PRIVATE
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find the post
    Post.findById(req.params.id)
      .then(post => {
        // get the comment's index
        const commentIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        if (commentIndex === -1) {
          // i.e. comment doesn't exist
          return res
            .status(404)
            .json({ nocomment: "The comment doesn't exist" });
        }

        // Splice the comment out of the array
        post.comments.splice(commentIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(() => res.status(404).json({ nopost: "Post not found" }));
  }
);

module.exports = router;
