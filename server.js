const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const userRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const postRouter = require("./routes/api/posts");

const app = express();

//Database Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// parse the body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// initialize passport to protect routes
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

//routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
