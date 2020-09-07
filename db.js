const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABSE_URL ||
        "postgres:postgres:postgres@localhost:5432/social"
);

module.exports.insertData = (first, last, email, password) => {
    return db.query(
        `
    INSERT INTO users (first, last, email, password)
    VALUES($1, $2, $3, $4)
    RETURNING id, password, email`,
        [first, last, email, password]
    );
};

module.exports.getHashed = (email) => {
    return db.query(
        `
    SELECT password FROM users WHERE email = $1`,
        [email]
    );
};

module.exports.getUser = (email) => {
    return db.query(
        `
    SELECT * FROM users WHERE email = $1`,
        [email]
    );
};

module.exports.getUserById = (id) => {
    return db.query(
        `
    SELECT * FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.getId = (email) => {
    return db.query(
        `
    SELECT id FROM users WHERE email = $1`,
        [email]
    );
};

module.exports.insertCode = (email, code) => {
    return db.query(
        `
    INSERT INTO reset_codes (email, code)
    VALUES($1, $2)`,
        [email, code]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
    SELECT * FROM reset_codes WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
        [email]
    );
};

module.exports.updatePassword = (email, hashed) => {
    return db.query(
        `
    UPDATE users
    SET password = $2
    WHERE email = $1,`,
        [email, hashed]
    );
};

module.exports.uploadImage = (imageUrl, id) => {
    return db.query(
        `
    UPDATE users
    SET imageUrl = $1
    WHERE id = $2 
    RETURNING imageUrl`,
        [imageUrl, id]
    );
};

module.exports.updateBio = (bio, id) => {
    return db.query(
        `
    UPDATE users SET bio = $1
    WHERE id = $2
    RETURNING bio`,
        [bio, id]
    );
};

module.exports.otherProfileInfo = (id) => {
    return db.query(
        `
    SELECT first, last, imageUrl, bio FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.getMostRecent = () => {
    return db.query(`
    SELECT * FROM users ORDER BY id DESC LIMIT 3
    `);
};

module.exports.getSearched = (val) => {
    return db.query(
        `
    SELECT * FROM users
    WHERE first ILIKE $1`,
        [val + "%"]
    );
};

module.exports.friendStatus = (id, userId) => {
    return db.query(
        `
    SELECT * FROM friendships
  WHERE (receiver_id = $1 AND sender_id = $2)
  OR (receiver_id = $2 AND sender_id = $1)`,
        [id, userId]
    );
};

module.exports.makeFriend = (userId, id) => {
    return db.query(
        `
    INSERT INTO friendships (sender_id, receiver_id)
    VALUES ($1, $2)`,
        [userId, id]
    );
};

module.exports.cancelRequest = (userId, id) => {
    return db.query(
        `
    DELETE FROM friendships
    WHERE (sender_id = $1 AND receiver_id = $2)
    RETURNING id`,
        [userId, id]
    );
};

module.exports.acceptRequest = (id, userId) => {
    return db.query(
        `
    UPDATE friendships
    SET accepted = TRUE
    WHERE (sender_id = $1 AND receiver_id = $2)
    RETURNING id`,
        [id, userId]
    );
};

module.exports.unfriend = (id, userId) => {
    return db.query(
        `
     DELETE FROM friendships
     WHERE (sender_id = $1 AND receiver_id = $2)
     RETURNING id`,
        [id, userId]
    );
};

module.exports.getFriends = (userId) => {
    return db.query(
        `
  SELECT users.id, first, last, imageUrl, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [userId]
    );
};

module.exports.getMessages = () => {
    return db.query(
        `
    SELECT users.id, users.first, users.last, users.imageUrl, chats.msg, chats.id, chats.chatter_id, chats.created_at
    FROM chats
    JOIN users
    ON (users.id = chats.chatter_id)
    ORDER BY chats.id DESC
    `
    );
};

module.exports.addMessage = (id, msg) => {
    return db.query(
        `
    INSERT INTO chats (chatter_id, msg)
    VALUES ($1, $2)
    RETURNING id, msg, chatter_id, created_at`,
        [id, msg]
    );
};

module.exports.getComments = (id) => {
    return db.query(
        `
    SELECT users.id, users.first, users.last, users.imageUrl, comments.id, comments.comment, comments.receiver, comments.sender, comments.created_at
    FROM comments
    JOIN users
    ON (sender = users.id)
    WHERE receiver = $1`,
        [id]
    );
};

module.exports.getOtherComments = (id) => {
    return db.query(
        `
    SELECT users.id, users.first, users.last, users.imageUrl, comments.id, comments.comment, comments.receiver, comments.sender, comments.created_at
    FROM comments
    JOIN users
    ON (sender = users.id)
    WHERE receiver = $1`,
        [id]
    );
};

module.exports.addComment = (comment, sender, receiver) => {
    return db.query(
        `
    INSERT INTO comments (comment, sender, receiver)
    VALUES ($1, $2, $3)
    RETURNING comment`,
        [comment, sender, receiver]
    );
};
