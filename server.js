const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const {connectDB} =require('./config/db');
const mainRoutes = require('./routes/mainRoutes.js');
const authRoutes = require('./routes/authRoutes.js');



app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

connectDB;

app.use("/",authRoutes);
app.use("/main",mainRoutes);

app.listen(port, () => {
    console.log(`listening on port http://localhost:3000`);
});
