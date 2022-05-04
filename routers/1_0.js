import express from "express";
import passport from "passport";
import { pool } from "../configs/db-config.js";
import jwt from "jsonwebtoken";
import { jwtTokenMiddelware, jwtAdminTokenCheckMiddelware, jwtPassportMiddelware, jwtRefresh } from "../middelware/jwt.js";
import bcrypt from "bcrypt";
import { ensureAuthenticated } from "../middelware/oAuth.js";

const secret = process.env.ACCESS_SECRET || "XXX";

const generateAccessToken = (username, email, superuser) => {
  const payload = { username, email, superuser };
  return jwt.sign(payload, secret, { expiresIn: 60 * 15 });
};

const generateRefreshToken = () => {
  const payload = {};
  return jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 });
};

const api1_0 = express.Router();

api1_0.get("/:lang/info", async (req, res) => {
  const lang = req.params.lang;
  const sql = "SELECT * FROM info WHERE lang=$1;";
  const result = await pool.query(sql, [lang]);

  if (!result.rows[0]) {
    return res.status(400).json({ statusCode: 1, message: "Something wrong" });
  } else {
    const myPhoto = "https://" + req.get("host") + "/pic/photo.jpg";
    res.json({ ...result.rows[0], photoUrl: myPhoto, statusCode: 0 });
  }
});

api1_0.post("/:lang/info", jwtAdminTokenCheckMiddelware, async (req, res) => {
  const lang = req.params.lang;
  const name = req.body.name;
  const profession = req.body.profession;
  const text = req.body.text;
  const contacts = req.body.contacts;
  const photoUrl = req.body.photoUrl;
  try {
    const sql = "UPDATE info SET name=$1, profession=$2, text=$3, contacts=$4 WHERE lang=$5;";
    await pool.query(sql, [name, profession, text, contacts, lang]);
  } catch (error) {
    res.status(400).json({ message: "Something wrong", statusCode: 1 });
  }
  res.status(200).json({
    data: { name, profession, text, contacts, photoUrl },
    message: "Information saved",
    statusCode: 0,
  });
});

api1_0.get("/auth/me", jwtTokenMiddelware, (req, res) => {
  const me = {
    username: req.user.username,
    email: req.user.email,
    superuser: req.user.superuser,
  };
  res.json({ user: me, statusCode: 0 });
});

api1_0.get("/auth/me/jwt", jwtPassportMiddelware, (req, res) => {
  const me = {
    username: req.user.username,
    email: req.user.email,
    superuser: req.user.superuser,
  };
  res.json({ user: me, statusCode: 0 });
});

api1_0.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", { failureFlash: true }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message, statusCode: info.statusCode });

    req.logIn(user, (err) => {
      if (err) return next(err);
      const accessToken = generateAccessToken(user.username, user.email, user.superuser);
      const refreshToken = generateRefreshToken();
      const userInfo = {
        username: user.username,
        email: user.email,
        superuser: user.superuser,
      };
      res.json({ user: userInfo, accessToken, refreshToken, statusCode: 0 });
    });
  })(req, res, next);
});

api1_0.post("/auth/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  if (email && username && password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const getAllUsers = "SELECT username FROM users_auth WHERE username LIKE $1;";
    const result = await pool.query(getAllUsers, [username]);

    if (!result.rows[0]) {
      const sql = "INSERT INTO users_auth (username, password, email, salt, superuser) VALUES ($1, $2, $3, $4, $5);";
      await pool.query(sql, [username, hashedPassword, email, salt, false]);
    } else {
      return res.status(400).json({ message: "Username already exist", statusCode: 1 });
    }

    const userInfo = { username, password };
    return res.status(200).json({
      user: userInfo,
      message: "Registration successful",
      statusCode: 0,
    });
  }
  res.status(400).json({ message: "Something wrong", statusCode: 1 });
});

api1_0.get("/auth/logout", (req, res) => {
  req.logout();
  res.json({ statusCode: 0 });
});

api1_0.post("/auth/refresh-tokens", jwtRefresh, (req, res) => {
  const accessToken = generateAccessToken(req.user.username, req.user.email, req.user.superuser);
  res.json({ accessToken, statusCode: 0 });
});

//================================= 
api1_0.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
  res.redirect("/");
});

api1_0.get("/auth/github", passport.authenticate('github', { scope: ["user:email"] }));

api1_0.get("/test", ensureAuthenticated, (req, res) => {
  res.status(200).json({ message: "successful", statusCode: 0 });
});

export default api1_0;
