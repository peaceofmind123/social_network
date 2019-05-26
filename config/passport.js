const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

// jwtstrategy options
const opts = {};

// specifies the type of token to extract (here bearer token)
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = require("./keys").secretKey;

// the passport module is passed in and is modified here
module.exports = passport =>
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // if passport can decode the payload, then it will contain user info
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user); // first param error, second param user
          }
          return done(null, false);
        })
        .catch(err => done(err, false));
    })
  );
