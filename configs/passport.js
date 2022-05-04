import passport from "passport"; //add pasport
import LocalStrategy from "passport-local"; //add pasport-local lirary
import bcrypt from "bcrypt"; //add dcrypt
import { findByUsername, findById } from "./db.js"; //connect file with user object

import NewJwtStrategy from "passport-jwt";
const JwtStrategy = NewJwtStrategy.Strategy;
import NewExtractJwt from "passport-jwt";
const ExtractJwt = NewExtractJwt.ExtractJwt;
import NewGitHubStrategy from "passport-github2";
const GitHubStrategy = NewGitHubStrategy.Strategy;
// import NewOAuth2Strategy from "passport-oauth2";
// const OAuth2Strategy = NewOAuth2Strategy.Strategy;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET,
  // jwtFromRequest: ExtractJwt.fromUrlQueryParameter("secret_token"),
};

// passport.use(
//   new OAuth2Strategy(
//     {
//       authorizationURL: "https://github.com/login/oauth/authorize",
//       tokenURL: 'https://github.com/login/oauth/access_token',
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: "http://localhost:3001/api/1.0/auth/github/callback",
//       scope: "user",
//     },
//     function (accessToken, refreshToken, params, profile, done) {
//       // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
//         // console.log(profile);
//         // console.log(accessToken);
//         // console.log(refreshToken);
//         // console.log(params)
//       return done(null, profile);
//     }
//   )
// );

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/1.0/auth/github/callback",
    },
    function (accessToken, refreshToken, params, profile, done) {
      // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
        // console.log(profile);
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(params)
      return done(null, profile);
    }
  )
);

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    findByUsername(jwt_payload.username, function (err, user) {
      if (err) return done(err, false);
      if (user) return done(null, user, { statusCode: 0 });

      return done(null, false, {
        message: "No user found",
        statusCode: 1,
      });
    });
  })
);

//set default pasport LocalStrategy
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
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // findById(id, (err, user) => {
    done(null, id);
  // });
});
