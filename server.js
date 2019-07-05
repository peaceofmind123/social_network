const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const userRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const postRouter = require("./routes/api/posts");
const path = require("path");
// cors: dev only
const cors = require("cors");

const app = express();

//cors: dev only: MUST REMOVE IN PRODUCTION
app.use(cors());
//Database Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB

mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// parse the body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// initialize passport to protect routes
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// disable caching of responses
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
//routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRouter);

// serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build")); // the build folder will be generated dynamically on heroku

  // anything other than our API routes shall be handled by the built index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
