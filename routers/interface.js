import express from 'express';
import { redirectLogin, redirectHome } from '../middelware/redirect.js';

const web = express.Router();

web.get('/', (req, res) => {
    res.redirect('./eng')
})

web.get('/:lang', (req, res) => {
   
    if(req.params.lang!=='ua'&&req.params.lang!=='eng') {
        res.status(404).send();
    } else {
        res.render('info', {lang: req.params.lang, isLogin: req.isAuthenticated()});
    }
    
})

web.get('/:lang/admin', redirectLogin, (req, res) => {
    let superuser;
    try {
        superuser = (req.user.superuser)?true:'';
    } catch {
        superuser = '';
    }

    res.render('admin', {lang: req.params.lang, superuser: superuser})
})

web.get('/api/login', redirectHome, (req, res) => {
    res.render('login')
})

web.get('/api/signup', redirectHome, (req,res) => {
    res.render('signup')
})

export {web};