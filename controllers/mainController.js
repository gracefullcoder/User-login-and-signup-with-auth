let User = require('../models/user');

let mainGet = async (req, res) => {
    if (!req.token) {
        res.render('loginpage.ejs');
    } else {
        let userEmail = req.authData.user.email;
        let userData = await User.find({ email: userEmail });
        console.log(userData);
        res.render("mainpage.ejs", { userData });
    }
}

module.exports = mainGet;