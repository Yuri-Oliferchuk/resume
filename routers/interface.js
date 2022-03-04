import express from 'express';

const web = express.Router();

web.get('/', (req, res) => {
    res.redirect('./eng')
})

web.get('/:lang', (req, res) => {
    res.render('info', {lang: req.params.lang});
})

web.get('/:lang/admin', (req, res) => {
    res.render('admin', {lang: req.params.lang})
})

export {web};