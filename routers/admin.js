import express from 'express';
import { pool } from '../configs/db-config.js';

const admin = express.Router();

admin.get('/', (req, res) => {
    res.send('Hello from /api');
})


export {api};