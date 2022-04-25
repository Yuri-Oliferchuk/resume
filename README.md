Resume
=============
Back-end part of project. 

APIs
====
GET - "/api/1.0/:lang/info" <br>
Get information from the database. <br>
good response - { name, profession, text, contacts, lang, photoUrl, statusCode: 0 } <br>
bad response - { message, statusCode: 1 } <br>
<br>
GET - "api/1.0/auth/me" <br>
User authorization check. <br>
request - {Headers: Authorisation = "Bearer"+token}
good response - { user: {username, email, superuser}, statusCode: 0 } <br>
bad response - {message statusCode: 1} <br>
<br>
GET - "/api/1.0/auth/logout" <br>
Logout <br>
good response - { statusCode: 0 } <br>
<br>
POST - "/api/1.0/:lang/info" <br>
Save information to database. <br>
request - { name, profession, text, contacts, photoUrl } <br>
good response - { data: {name, profession, text, contacts, photoUrl}, message, statusCode: 0 } <br>
bad response - { message, statusCode: 1 } <br>
<br>
POST - "/api/1.0/auth/login" <br>
Login. <br>
request - { username, password } <br>
good response - { user: {username, email, superuser}, token, statusCode: 0 } <br>
bad response - { message, statusCode: 1 } <br>
<br>
POST - "/api/1.0/auth/signup" <br>
Create new user. <br>
request - { username, email, password } <br>
good response - { user: {username, password}, message, statusCode: 0 } <br>
bad response - { message, statusCode: 1 } <br>
<br>

Middlewares
===========
_redirectLogin_ - redirect to login page<br>
_redirectHome_ - redirecto to home page<br>
_jwtTokenMiddelware_ - check JWT autorisation success <br>
_jwtAdminTokenMiddelware("USER")_ - check JWT autorisation with user role (can access only users with role "USER") <br>
<br>

Function for working with database
==================================
- __findById()__ - Function for finding user by ID in database<br>
- __findByUserName()__ - Function for finding user by Username in database<br>
<br>
__"cat init.sql | heroku pg:psql <db.name> --app <app.name>"__ - for installing start database to heroku <br>
__init.sql__ - file for initialize start database<br>
<br>
.env
====
DB_USER=summary<br>
DB_PASSWORD=password<br>
DB_HOST=localhost<br>
DB_PORT=5432<br>
DB_DATABASE=postgres<br>
NODE_ENV=development<br>