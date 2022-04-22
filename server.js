import 'dotenv/config';
import './configs/passport.js'
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';                        
import session from 'express-session';
import passport from 'passport';
import flash from 'express-flash';
import { fileURLToPath } from 'url'; 
import { api } from './routers/api.js';
import { web } from './routers/interface.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:2000", "http://localhost:3000"], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');                           
app.use(express.static(path.join(__dirname, '/public')));

// add body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session config
app.use(flash())
app.use(session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: "XXXX",
    cookie: {
      maxAge: 1000*60*60*2,
      sameSite: false,
      secure: false,
    }
}))
  
// Passport Config
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use('/api', api);
app.use('/', web)


app.listen(PORT, () => {
    console.log(`Server started ... \nhttp://localhost:${PORT}`);
})