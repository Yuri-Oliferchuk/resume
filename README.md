Resume
=============


APIs
====
Interface API
-------------




Other API
---------


Middlewares
===========



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
DB_USER=photo_caption<br>
DB_PASSWORD=password<br>
DB_HOST=localhost<br>
DB_PORT=5432<br>
DB_DATABASE=postgres<br>
NODE_ENV=development<br>