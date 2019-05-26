// router file that handles requests to api/posts
// handles tasks such as creating, updating, liking, unliking posts

const router = require("express").Router();

// @route GET api/posts/test
// @desc  a test route
router.get("/test", (req, res) => res.json({ msg: "posts route works" }));
module.exports = router;
