const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const jwt = require('jsonwebtoken');
const secretKey = "secretkey";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const cookieParser = require('cookie-parser')

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

main()
    .then(() => {
        console.log("Connection was successful");
    })
    .catch(err => console.log(err));

async function main() {
    const connectionString = 'mongodb+srv://vaibhav:Svnit1103@koethecafe.8x5wmra.mongodb.net/';
    await mongoose.connect(connectionString);
}

app.get("/", (req, res) => {
    res.render("signup.ejs");
});

app.get("/login", (req, res) => {
    res.render("loginpage.ejs");
});

app.post("/signup", async (req, res) => {
    let { username, useremail, userpassword } = req.body;
    let hashedPassword = await bcrypt.hash(userpassword, 10); // Hash the password
    let user = { name: username, email: useremail, password: hashedPassword };
    jwt.sign({ user }, secretKey, { expiresIn: '30s' }, async (err, token) => {
        if (!err) {
            console.log(token);
            let newUser = new User(user);
            await newUser.save();
            res.cookie("jwttoken", token, {
                httpOnly: true
            });
            res.redirect('/main');
        }
    });
});

app.post("/login", verifyToken, async (req, res) => {
    let { useremail, userpassword } = req.body;
    let user = { email: useremail };
    let userData = await User.findOne({ email: useremail });
    if (userData.length != 0) {
        let passwordMatch = await bcrypt.compare(userpassword, userData.password);
        if (passwordMatch) {
            jwt.sign({ user }, secretKey, { expiresIn: '30s' }, (err, token) => {
                if (!err) {
                    res.cookie("jwttoken", token, {
                        httpOnly: true
                    });
                    res.redirect('/main');
                }
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

app.get("/main", verifyToken, async (req, res) => {
    jwt.verify(req.cookies.jwttoken, secretKey, async (err, authData) => {
        if (err) {
            res.redirect('/login');
        } else {
            let userEmail = authData.user.email;
            let userData = await User.find({ email: userEmail });

            console.log(userData);
            res.render("mainpage.ejs", { userData });
        }
    });
});

function verifyToken(req, res, next) {
    const cookieData = req.cookies.jwttoken;
    if (cookieData) {
        req.token = cookieData;
        next();
    } else {
        res.json({ token: "is not valid" });
    }
}

app.listen(port, () => {
    console.log(`listening on port http://localhost:3000`);
});
