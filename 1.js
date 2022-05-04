import express from "express";
import "dotenv/config";
import passport from "passport";
import methodOverride from 'method-override'
import partials from 'express-partials'

import session from "express-session";

import bodyParser from "body-parser";

// import { Strategy as GitHubStrategy } from 'passport-github2';
import NewGitHubStrategy from "passport-github2";
const GitHubStrategy = NewGitHubStrategy.Strategy;

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/1.0/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

var app = express();

// configure Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: "XXXX",
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 2,
    //   sameSite: true,
    //   secure: false,
    // },
  })
);

// Passport Config
app.use(partials());
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

app.get("/", ensureAuthenticated, function (req, res) {
  console.log("Redirect - " + req.isAuthenticated());
  res.send("index");
});

app.get("/account", ensureAuthenticated, function (req, res) {
  res.json(req.user);
});

app.get("/login", function (req, res) {
  res.send("login");
});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }), function (req, res) {
  // The request will be redirected to GitHub for authentication, so this
  // function will not be called.
});

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get("/api/1.0/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
  console.log("Callback - " + req.isAuthenticated());
  res.redirect("/");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3001);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    console.log("middelware - " + req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
