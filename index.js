const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const secret = require("./secrets.json");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { isUndefined } = require("util");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// app.use(
//     cookieSession({
//         secret: secret.secret,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: secret.secret,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.json());

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static("public"));

app.post("/register", (req, res) => {
    // console.log("req.body: ", req.body);
    // insert the data into a db and hash the password
    let firstName = req.body.first;
    let secondName = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    if (firstName != "" && secondName != "" && email != "" && password != "") {
        hash(password)
            .then((hashedPassword) => {
                console.log(
                    "Hashed password in registration: ",
                    hashedPassword
                );
                db.insertData(firstName, secondName, email, hashedPassword)
                    .then((result) => {
                        console.log("IMPORTANT", result);
                        req.session.userId = result.rows[0].id; // here we set userId
                        res.json({ success: true });
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    } else {
        res.json({ succes: false });
    }
});

app.post("/reset", (req, res) => {
    // console.log("req.body: ", req.body);
    if (req.body.email != "") {
        db.getUser(req.body.email)
            .then((resp) => {
                if (resp.rows.length < 1) {
                    res.json({ success: false });
                } else {
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    db.insertCode(req.body.email, secretCode)
                        .then(() => {
                            let recipient = req.body.email;
                            let message = secretCode;
                            let subject = "Hallo";
                            ses.sendEmail(recipient, message, subject);
                        })
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => console.log("HHHH", err));
    } else {
        res.json({
            error: "Please enter a valid email address",
        });
    }
});

app.post("/reset/verify", (req, res) => {
    // console.log(req.body);
    // console.log("this should be new", req.body.password);
    db.getCode(req.body.email)
        .then((result) => {
            console.log("UUUU", result);
            hash(req.body.password)
                .then((hashed) => {
                    db.updatePassword(req.body.email, hashed);
                    res.json({ success: true });
                })
                .catch((err) => console.log("I am fucking error", err));
        })
        .catch((err) => console.log(err));
});

app.post("/login", (req, res) => {
    // console.log("req.body: ", req.body);
    let logMail = req.body.email; // this does not refer to the input name but to the output of req.body!!Always check the terminal an see req.body before naming your variables
    let logPass = req.body.password;
    if (logMail != "" && logPass != "") {
        db.getHashed(logMail)
            .then((HpassObj) => {
                console.log("LOOK", HpassObj);
                let Hpass = HpassObj.rows[0].password;
                compare(logPass, Hpass)
                    .then((match) => {
                        console.log("Password is correct? ", match);
                        if (match) {
                            db.getId(logMail)
                                .then((result) => {
                                    console.log("result: ", result);
                                    req.session.userId = result.rows[0].id;
                                    res.json({ success: true });
                                })
                                .catch((err) => console.log(err));
                        } else {
                            res.json({ success: false });
                        }
                    })
                    .catch((err) => console.log("OR ME ?", err));
            })
            .catch((err) => console.log("AM I WRONG ?", err));
    } else {
        res.redirect("login");
    }
});

app.get("/user", (req, res) => {
    // console.log(req.body);
    db.getUserById(req.session.userId)
        .then((data) => {
            // console.log("HEY!", data);
            res.json(data.rows[0]);
        })
        .catch((err) => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("file: ", req.file);
    // console.log("req.body", req.body);
    let url = `https://s3.amazonaws.com/imageboard-bucket/${req.file.filename}`;
    if (req.file) {
        db.uploadImage(url, req.session.userId)
            .then((val) => {
                console.log("UPLOADING!", val);
                res.json(val.rows);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/bio", async function (req, res) {
    try {
        // console.log(req.body);
        const data = await db.updateBio(req.body.bioArea, req.session.userId);
        // console.log(data);
        res.json(data.rows[0].bio);
    } catch (err) {
        console.log(err);
    }
});

app.get("/user/:id.json", async function (req, res) {
    if (req.params.id != req.session.userId) {
        try {
            const data = await db.otherProfileInfo(req.params.id);
            res.json(data.rows[0]);
        } catch (err) {
            console.log(err);
        }
    } else {
        res.json({ isSelf: true });
    }
});

app.get("/users/:searched.json", async function (req, res) {
    if (req.params.searched === " ") {
        try {
            const data = await db.getMostRecent();
            res.json(data.rows);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const data = await db.getSearched(req.params.searched);
            // console.log("KKK", data);
            res.json(data.rows);
        } catch (err) {
            console.log(err);
        }
    }
});

app.get("/initial-friendship-status/:id", async function (req, res) {
    // console.log(req.params.id);
    // console.log(req.session.userId);
    try {
        const data = await db.friendStatus(req.session.userId, req.params.id);
        // console.log("LAS", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/make-friend-request/:id", async function (req, res) {
    // console.log(req.params.id);
    try {
        const data = await db.makeFriend(req.session.userId, req.params.id);
        // console.log("VEGAS", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/cancel-friend-request/:id", async function (req, res) {
    console.log(req.params.id);
    try {
        const data = await db.cancelRequest(req.session.userId, req.params.id);
        // console.log(data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/accept-friend-request/:id", async function (req, res) {
    try {
        const data = await db.acceptRequest(req.params.id, req.session.userId);
        console.log("COSA SONO?", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/end-friendship/:id", async function (req, res) {
    try {
        // const data = await db.cancelRequest(req.session.userId, req.params.id);
        const otherData = await db.unfriend(req.params.id, req.session.userId);
        console.log("Problemi?: ", otherData);
        res.json(otherData.rows);
    } catch (err) {
        console.log(err);
    }
});

app.get("/friends.json", async function (req, res) {
    try {
        const data = await db.getFriends(req.session.userId);
        // console.log("WOWO", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.get("/comments/:id", async function (req, res) {
    console.log("req.params.id: ", req.params.id);
    console.log(req.body);
    try {
        const data = await db.getOtherComments(req.params.id);
        console.log("I am data from req.params: ", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.get("/comment", async function (req, res) {
    console.log(req.body);
    try {
        const data = await db.getComments(req.session.userId);
        console.log("I am data from req.session: ", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/addComment/:id", async function (req, res) {
    console.log("I should be full", req.body);
    console.log(req.params.id);
    try {
        const data = await db.addComment(
            req.body.comment,
            req.session.userId,
            req.params.id
        );
        console.log("I am comment data posted in a friend Wall: ", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/addComment", async function (req, res) {
    console.log(req.body);
    try {
        const data = await db.addComment(
            req.body.comment,
            req.session.userId,
            req.session.userId
        );
        console.log("I am comment data posted in my own Wall: ", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.end();
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("welcome");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

io.on("connection", async function (socket) {
    // all our socket code must goes here
    console.log(`socket id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    console.log("socket userId: ", userId);

    try {
        let data = await db.getMessages();
        console.log("LOOK", data);
        let messages = data.rows;
        io.sockets.emit("most recents messages", messages.reverse());
    } catch (err) {
        console.log(err);
    }
    //no axios request needed in actions.js!!

    socket.on("new message", async (newMsg) => {
        console.log("this message comes from chat.js", newMsg);
        //1st argument listens to the eventn that will be coming from chat.js
        //2nd is the info that comes along with the emit from chat.js
        console.log("user who sent newMsg is: ", userId);
        try {
            const msg = await db.addMessage(userId, newMsg);
            console.log(msg);
            const chatter = await db.getUserById(userId);
            console.log(chatter);

            const newMessage = {
                msg_id: msg.rows[0].id,
                user_id: chatter.rows[0].id,
                first: chatter.rows[0].first,
                last: chatter.rows[0].last,
                msg: msg.rows[0].msg,
                imageurl: chatter.rows[0].imageurl,
                created_at: msg.rows[0].created_at,
            };
            //1) do a db query to store the new chat msg into the chat table
            //2) do a db query to get info about the user(first, last, img) will probably need a join
            //3) once you have this info, emit our msg to everyone

            io.sockets.emit("addChatMsg", newMessage);
        } catch (err) {
            console.log(err);
        }
    });
});

server.listen(8080, function () {
    console.log("I'm listening.");
});
