import express from 'express';
import passport from 'passport';
import { pool } from '../configs/db-config.js';
import jwt from 'jsonwebtoken';
import { jwtTokenMiddelware, jwtAdminTokenMiddelware } from '../middelware/redirect.js';

const secret = process.env.ACCESS_SECRET || "XXX";

const generateAccessToken = (username, email, superuser) => {
    const payload = {username, email, superuser};
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

const api1_0 = express.Router();

api1_0.get('/:lang/info', async(req, res) => {
    const lang = req.params.lang;
    const sql = 'SELECT * FROM info WHERE lang=$1;';
    const result = await pool.query(sql, [lang]);

    if (!result.rows[0]) {res.json({statusCode: 1, message: "Something wrong"});}
    else {
        const myPhoto = 'http://' + req.get('host') + '/pic/photo.jpg';
        res.json({...result.rows[0], photoUrl: myPhoto, statusCode: 0});
    }
})

api1_0.get("/auth/me", jwtTokenMiddelware, (req, res) => {
    const me = {
        username: req.user.username,
        email: req.user.email,
        superuser: req.user.superuser
    }
    res.json({user: me, statusCode: 0})
  })

api1_0.post('/auth/login', (req, res, next) => 
    {
        passport.authenticate('local', {failureFlash: true },
            (err, user, info) => {
                if(err) return next(err)
                if(!user) return res.status(401).json({message: info.message, statusCode: info.statusCode})

                req.logIn(user, err => {
                    if(err)
                        return next(err)
                    const token = generateAccessToken(user.username, user.email, user.superuser)
                    res.json({ id: user.id, 
                               username: user.username, 
                               token: token,
                               statusCode: 0 })
                })
        })(req, res, next)
    }
);

api1_0.get('/auth/logout', (req, res) => {
    req.logout();
    res.json({statusCode: 0});
});


export default api1_0;