import express from 'express';
import { pool } from '../configs/db-config.js';

const api = express.Router();

api.get('/', (req, res) => {
    res.send('Hello from /api');
})

api.get('/:lang/admin', (req, res) => {
    res.redirect('../../'+req.params.lang+'/admin')
})

api.get('/:lang/admin/info', async(req, res) => {
    const lang = req.params.lang;
    const sql = 'SELECT * FROM info WHERE lang=$1;';
    const result = await pool.query(sql, [lang]);
    res.json(result.rows[0]);
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

export {api};