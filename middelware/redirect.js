import jwt from "jsonwebtoken";
import passport from "passport";

//function for redirect if user not loged in
const redirectLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/api/login");
  } else {
    next();
  }
};

//function for redirect if user authorized
const redirectHome = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
};

export {
  redirectLogin,
  redirectHome,
};
