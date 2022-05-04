import passport from "passport"; //add pasport
import LocalStrategy from "passport-local"; //add pasport-local lirary
import bcrypt from "bcrypt"; //add dcrypt
import { findByUsername } from "./db.js"; //connect file with user object

// import NewJwtStrategy from "passport-jwt";
// const JwtStrategy = NewJwtStrategy.Strategy;
// import NewExtractJwt from "passport-jwt";
// const ExtractJwt = NewExtractJwt.ExtractJwt;
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/1.0/auth/github/callback",
    },
    function (accessToken, refreshToken, params, profile, done) {
      return done(null, profile);
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET,
    },
    function (jwt_payload, done) {
      findByUsername(jwt_payload.username, function (err, user) {
        if (err) return done(err, false);
        if (user) return done(null, user, { statusCode: 0 });

        return done(null, false, {
          message: "No user found",
          statusCode: 1,
        });
      });
    }
  )
);

passport.use(
  new LocalStrategy(function verify(username, password, done) {
    findByUsername(username, async function (err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: "No user found", statusCode: 1 });
      }
      password = await bcrypt.hash(password, user.salt);
      if (user.password != password) {
        return done(null, false, { message: "Wrong password", statusCode: 1 });
      }
      return done(null, user, { statusCode: 0 });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
