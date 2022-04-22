import express from 'express';
import passport from 'passport';                            //add pasport
import bcrypt from 'bcrypt';     
import api1_0 from './1_0.js';         
import { pool } from '../configs/db-config.js';
import { redirectLogin, redirectHome } from '../middelware/redirect.js';

const api = express.Router();
api.use('/1.0', api1_0);

// api.get('/', (req, res) => {
//     res.send('Hello from /api');
// })

api.get('/:lang/admin', redirectLogin, (req, res) => {
    res.redirect('../../'+req.params.lang+'/admin')
})

api.get('/:lang/admin/info', async(req, res) => {
    const lang = req.params.lang;
    const sql = 'SELECT * FROM info WHERE lang=$1;';
    const result = await pool.query(sql, [lang]);

    const myPhoto = 'https://' + req.get('host') + '/pic/photo.jpg';

    res.json({...result.rows[0], photoUrl: myPhoto});
})

api.post('/:lang/admin/info', async(req, res) => {
    const lang = req.params.lang;
    const name = req.body.name;
    const profession = req.body.profession;
    const text = req.body.text;
    const contact = req.body.contact;
    const sql = 'UPDATE info SET name=$1, profession=$2, text=$3, contacts=$4 WHERE lang=$5;';
    await pool.query(sql, [name, profession, text, contact, lang]);
    res.status(201).redirect('../../'+lang+'/admin');
})

api.post('/login', redirectHome, 
          passport.authenticate('local', {
              failureRedirect: '/api/login',
              successRedirect: '/',
              failureFlash: true
            })
);

api.post('/signup', redirectHome, async(req, res) => {
    const {username, email, password} = req.body;

    if (email&&username&&password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const sql = 'INSERT INTO users_auth (username, password, email, salt, superuser) VALUES ($1, $2, $3, $4, $5);'
        await pool.query(sql, [username, hashedPassword, email, salt, false])
        
        req.flash('error', 'Registration successful');
        return res.redirect('/api/login')
    }
    return res.redirect('/api/signup'); // if any errors
})

api.get('/logout', redirectLogin, (req, res) => {
    req.logout();
    res.redirect('/');
});

export {api};