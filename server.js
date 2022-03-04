import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { api } from './routers/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');                           
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', api);

app.get('/', (req, res) => {
    res.send(`Hello ${process.env.DB_USER}`);
})

app.listen(PORT, () => {
    console.log(`Server started ... \nhttp://localhost:${PORT}`);
})