--DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    imageUrl TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--DROP TABLE IF EXISTS reset_codes;

CREATE TABLE reset_codes(
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  receiver_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT FALSE NOT NULL
);

--DROP TABLE IF EXISTS chats;

CREATE TABLE chats(
  id SERIAL PRIMARY KEY,
  msg VARCHAR NOT NULL,
  chatter_id INT REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  comment VARCHAR NOT NULL,
  sender INT REFERENCES users(id) NOT NULL,
  receiver INT REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
