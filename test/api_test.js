import express from "express";
import bodyParser from 'body-parser'; 
import request from "supertest";
import assert from "assert";
import api1_0 from '../routers/1_0.js';

import '../configs/passport.js'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/1.0', api1_0);

describe ('API 1.0 test', () => {
    describe('GET /:lang/info', () => { 
        before( async () => {
            global.responseUA = await request(app).get('/api/1.0/ua/info');
            global.responseENG = await request(app).get('/api/1.0/eng/info');
        })  
        it('sohuld return code 200 if response OK', async () => {

            assert.equal(global.responseUA.status, 200);
            assert.equal(global.responseENG.status, 200);
        })
        it('sohuld return code 400 if response has wrong params', async () => {
            let responseUA = await request(app).get('/api/1.0/ua1/info');
            let responseENG = await request(app).get('/api/1.0/eng1/info');

            assert.equal(responseUA.status, 400);
            assert.equal(responseENG.status, 400);
        })
        it('sohuld return code 404 if response BAD', async () => {
            let responseUA = await request(app).get('/api/1.0/ua/info1');
            let responseENG = await request(app).get('/api/1.0/eng/info1');

            assert.equal(responseUA.status, 404);
            assert.equal(responseENG.status, 404);
        })
        it('sohuld return response with correct statusCode', async () => {

            assert.equal(global.responseUA.body.statusCode, 0);
            assert.equal(global.responseENG.body.statusCode, 0);
            let responseUA = await request(app).get('/api/1.0/ua1/info');
            let responseENG = await request(app).get('/api/1.0/eng1/info');
            assert.equal(responseUA.body.statusCode, 1);
            assert.equal(responseENG.body.statusCode, 1);
        })
        it('sohuld return JSON format', async () => {

            assert.match(global.responseUA.headers['content-type'], /json/);
            assert.match(global.responseENG.headers['content-type'], /json/);
        })
        it('sohuld return object with right keys', async () => {
            const result = "name,profession,text,contacts,lang,photoUrl,statusCode";
            
            const keysUA = Object.keys(global.responseUA.body).toString()
            const keysENG = Object.keys(global.responseENG.body).toString()
            
            assert.equal(keysENG, result);
            assert.equal(keysUA, result);            
        })
    })
    describe('POST /auth/login', () => { 
        it('should return token and code 200 if request OK', async () => {
            const response = await request(app)
                .post('/api/1.0/auth/login')
                .send({ username: "admin", password: "secret" })

            assert.equal(response.status, 200);
            assert.notEqual(response.body.token, '');
        })
        it('should return code 401, message "No user found" and statusCode=1 if username wrong', async () => {
            const response = await request(app)
                .post('/api/1.0/auth/login')
                .send({ username: "xxx", password: "xxxxxx" })
            
            assert.equal(response.status, 401);
            assert.equal(response.body.message, "No user found");
            assert.equal(response.body.statusCode, 1);
        }) 
        it('should return code 401, message "Wrong password" and statusCode=1 if password wrong', async () => {
            const response = await request(app)
                .post('/api/1.0/auth/login')
                .send({ username: "admin", password: "xxxxxx" })
            
            assert.equal(response.status, 401);
            assert.equal(response.body.message, "Wrong password");
            assert.equal(response.body.statusCode, 1);
        })  
        it('should return code 404 if response BAD', async () => {
            const response = await request(app)
                .post('/api/1.0/auth/login1')
            
            assert.equal(response.status, 404);
        })
        it('sohuld return object with right keys', async () => {
            const responseResult = "user,token,statusCode";
            const userResult = "username,email,superuser";
            const response = await request(app)
                .post('/api/1.0/auth/login')
                .send({ username: "admin", password: "secret" })

            const responseKeys = Object.keys(response.body).toString()
            const userKeys = Object.keys(response.body.user).toString()
            
            assert.equal(responseKeys, responseResult, "Response object has wrong fields");
            assert.equal(userKeys, userResult, "User object has wrong fields");
        })   
    })
})