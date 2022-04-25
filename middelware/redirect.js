import jwt from 'jsonwebtoken';

//function for redirect if user not loged in
const redirectLogin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.redirect('/api/login');
    } else {
        next();
    }
}
  
//function for redirect if user authorized
const redirectHome = (req, res, next) => {
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
}

const jwtTokenMiddelware = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    const secret = process.env.ACCESS_SECRET || "XXX"

    try {
        const token = req.headers.authorization;
        // const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(401).json({message:"Invalid token", statusCode: 1})
        }
        const decodeData = jwt.verify(token, secret);
        // if(req.user.username !== decodeData.username || req.user.id !== decodeData.id) {
        //     res.status(401).json({message:"Invalid token", statusCode: 1})
        // }
        req.user = decodeData;
        next()
    } catch(e) {
        console.log(e);
        return res.status(401).json({message:"User not authorized", statusCode: 1});
    }
}

const jwtAdminTokenCheckMiddelware = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    const secret = process.env.ACCESS_SECRET || "XXX"
    try {
        const token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({message:"User not authorized", statusCode: 1})
        }
        const decodeData = jwt.verify(token, secret);
        const isRole = (decodeData.superuser)? "SUPERUSER" : null;
        if (!isRole) {
            return res.status(403).json({message:"You don't have permission", statusCode: 1})
        }
        console.log(isRole);
        next()
    } catch(e) {
        console.log(e);
        const message = {message:"User not authorized", statusCode: 1};
        return res.status(401).json(message);
    }
}

export {
    redirectLogin,
    redirectHome,
    jwtTokenMiddelware,
    jwtAdminTokenCheckMiddelware
}