import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { api } from './routers/api.js';
import { web } from './routers/interface.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');                           
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', api);
app.use('/', web)


app.listen(PORT, () => {
    console.log(`Server started ... \nhttp://localhost:${PORT}`);
})