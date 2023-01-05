CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    coverPic VARCHAR(255),
    profilePic VARCHAR(255),
    city VARCHAR(255),
    website VARCHAR(255)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY NOT NULL,
    descp VARCHAR(255) NOT NULL,
    img VARCHAR(255)
);

ALTER TABLE posts ADD COLUMN userId INT NOT NULL REFERENCES users(id);

ALTER TABLE posts ADD COLUMN createdAt TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE posts ADD COLUMN publicId VARCHAR(255);


CREATE TABLE comments (
    id SERIAL PRIMARY KEY NOT NULL,
    descp VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW() 
    userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    postId INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);


CREATE TABLE stories (
    id SERIAL PRIMARY KEY NOT NULL,
    img VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE relationships (
    id SERIAL PRIMARY KEY NOT NULL,
    followerUserId INT NOT NULL REFERENCES users(id) ON DELETE cascade,
    followedUserId INT NOT NULL REFERENCES users(id) ON DELETE cascade
);


CREATE TABLE likes (
    id SERIAL PRIMARY KEY NOT NULL,
    userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    postId INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);


//one example of inserting a postId
INSERT INTO posts(id, descp, img, userId, createdAt) VALUES(1, 'first post here', 'https://img.freepik.com/free-photo/purple-osteospermum-daisy-flower_1373-16.jpg?w=2000', 1, '2019-11-28T17:58:12.776Z');