CREATE TABLE users_auth (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL, 
    superuser BOOLEAN NOT NULL
);

INSERT INTO users_auth (username, password, email, salt, superuser)
VALUES ('admin', '$2b$10$Yr2SlyMCwuhrwivZY0EPhO9/xWd7/OzPj1V2GzsI4mz5J.7wPua3e', 'admin@mail.com', '$2b$10$Yr2SlyMCwuhrwivZY0EPhO', true), 
       ('Yura', '$2b$10$Yr2SlyMCwuhrwivZY0EPhO9/xWd7/OzPj1V2GzsI4mz5J.7wPua3e', 'yura@mail.com', '$2b$10$Yr2SlyMCwuhrwivZY0EPhO', false);

CREATE TABLE info (
    name VARCHAR(255) NOT NULL,
    photo_link VARCHAR(255) NOT NULL,
    text VARCHAR NOT NULL,
    contacts VARCHAR NOT NULL,
    lang VARCHAR(5)
);

INSERT INTO info (name, photo_link, text, contacts, lang)
VALUES ('Oliferchuk Yuriy', './../photo.jpg', '<h1>Hello world!!!</h1>', 'Contacts:', 'eng'),
       ('Оліферчук Юрій Володимирович', './../photo.jpg', '<h1>Привіт світ!!!</h1>', 'Контакти:', 'ua');