function ensureAuthenticated(req, res, next) {
  console.log("middelware - " + req.isAuthenticated());
if (req.isAuthenticated()) {
  return next();
}
res.redirect("/login");
}

export { ensureAuthenticated };
