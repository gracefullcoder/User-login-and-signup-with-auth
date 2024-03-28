const jwt = require('jsonwebtoken');
const secretKey = "secretkey";
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRoutes = require("../routes/mainRoutes");

let signupGet = (req, res) => {
    if (req.token) {
        res.redirect("/main");
    } else {
        res.render("signup.ejs");
    }
}

let loginGet = (req, res) => {
    if (req.token) {
        res.redirect("/main");
    } else {
        res.render("loginpage.ejs");
    }
}

let loginPost = async (req, res) => {
    let { useremail, userpassword } = req.body;
    let user = { email: useremail };
    let userData = await User.findOne({ email: useremail });
    if (userData) {
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
}

let signupPost = async (req, res) => {
    let { username, useremail, userpassword } = req.body;
    let hashedPassword = await bcrypt.hash(userpassword, 10); // Hash the password
    let user = { name: username, email: useremail, password: hashedPassword };
    let userData = await User.findOne({ email: user.email });
    if (!userData) {
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
    } else {
        res.send("user already exist go and login");
    }
}

module.exports = {loginGet,loginPost,signupGet,signupPost};