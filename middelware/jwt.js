import jwt from "jsonwebtoken";
import passport from "passport";

const jwtTokenMiddelware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  const secret = process.env.ACCESS_SECRET || "XXX";

  try {
    const token = req.headers.authorization;
    // const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token", statusCode: 1 });
    }
    const decodeData = jwt.verify(token, secret);
    // if(req.user.username !== decodeData.username || req.user.id !== decodeData.id) {
    //     res.status(401).json({message:"Invalid token", statusCode: 1})
    // }
    req.user = decodeData;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ message: "User not authorized", statusCode: 1 });
  }
};

const jwtAdminTokenCheckMiddelware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  const secret = process.env.ACCESS_SECRET || "XXX";
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User not authorized", statusCode: 1 });
    }
    const decodeData = jwt.verify(token, secret);
    const isRole = decodeData.superuser ? "SUPERUSER" : null;
    if (!isRole) {
      return res
        .status(403)
        .json({ message: "You don't have permission", statusCode: 1 });
    }
    console.log(isRole);
    next();
  } catch (e) {
    const message = { message: "User not authorized", statusCode: 1 };
    return res.status(401).json(message);
  }
};

const jwtPassportMiddelware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    
    try {
      let token = req.headers.authorization.split(" ")[1];
      const secret = process.env.ACCESS_SECRET || "XXX";
          console.log("\n " + token);  
          console.log("\n " + secret);
          console.log("\n " + user);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid token", statusCode: 1 });
      }
          console.log("\n " + req.user.username);
          console.log("\n " + jwt.verify(token, secret).username);
      if (req.user.username !== jwt.verify(token, secret).username) {
        return res
          .status(401)
          .json({ message: "Token from other user", statusCode: 1 });
      }
      next();
    } catch (e) {
      return res
        .status(401)
        .json({ message: "User not authorized", statusCode: 1 });
    }
  })(req, res, next);
};

const jwtRefresh = (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken.split(" ")[1];
    const parsedToken = jwt.verify(refreshToken, process.env.ACCESS_SECRET, {
      complete: true,
    });
    const now = Math.floor(Date.now() / 1000);
    if (parsedToken.payload.exp - now > 0) next();
  } catch {
    return res
      .status(401)
      .json({ message: "User not authorized", statusCode: 1 });
  }
};

export {
  jwtTokenMiddelware,
  jwtAdminTokenCheckMiddelware,
  jwtPassportMiddelware,
  jwtRefresh,
};
