import express from 'express';

const api = express.Router();

api.get('/', (req, res) => {
    res.send('Hello from /api');
})

api.get('/:lang/admin', (req, res) => {
    res.redirect('../../'+req.params.lang+'/admin')
})

export {api};