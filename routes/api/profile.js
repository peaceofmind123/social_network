// router file that handles requests to api/profile
// handles tasks such as creating, viewing, updating, deleting profile of a user
// mostly will contain protected routes

const router = require("express").Router();

// @route GET api/profile/test
// @desc  a test route
router.get("/test", (req, res) => res.json({ msg: "profile route works" }));
module.exports = router;
