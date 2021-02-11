/*
    VARIABLES AND REQUIREMENTS
    ================================================================
*/

const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoserver = require("./config/database")();
const logger = require('./logger/logger');
const fs = require('fs');
const generateToken = require("./config/secret")();
const user = require("./routes/user");
const exercise = require("./routes/exercise");
const admin = require("./routes/admin");


// SSL

var options = {
    key: fs.readFileSync('ssl/certificate.key'),
    cert: fs.readFileSync('ssl/certificate.crt')
};


/*
    SERVER
    ================================================================
*/


var server = https.createServer(options, app);

server.listen(443, () => {
    logger.log("INFO", "\x1b[32m", "Server started", "host", "localhost", "port", 443);
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/*
    routes
*/

app.use("/user", user);
app.use("/exercise", exercise);
app.use("/admin", admin);

/*
    get pages
*/


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/register.html'));
});

/*
    get css
*/

app.get("/css/style.css", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/css/style.css'));
});

app.get("/css/fontawesome.css", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/css/fontawesome.css'));
});

/*
    get fonts
*/
app.get("/fonts/Cabrion-Bold.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/Cabrion-Bold.ttf'));
});

app.get("/fonts/Cabrion-Medium.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/Cabrion-Medium.ttf'));
});

app.get("/fonts/Cabrion-Regular.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/Cabrion-Regular.ttf'));
});

app.get("/fonts/Cabrion-Thin.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/Cabrion-Thin.ttf'));
});

app.get("/fonts/HammersmithOne-Regular.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/HammersmithOne-Regular.ttf'));
});

// fontawesome


app.get("/fonts/fontawesome/fa-brands-400.eot", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-brands-400.eot'));
});

app.get("/fonts/fontawesome/fa-brands-400.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-brands-400.svg'));
});

app.get("/fonts/fontawesome/fa-brands-400.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-brands-400.ttf'));
});

app.get("/fonts/fontawesome/fa-brands-400.woff", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-brands-400.woff'));
});

app.get("/fonts/fontawesome/fa-brands-400.woff2", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-brands-400.woff2'));
});


app.get("/fonts/fontawesome/fa-light-300.eot", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-light-300.eot'));
});

app.get("/fonts/fontawesome/fa-light-300.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-light-300.svg'));
});

app.get("/fonts/fontawesome/fa-light-300.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-light-300.ttf'));
});

app.get("/fonts/fontawesome/fa-light-300.woff", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-light-300.woff'));
});

app.get("/fonts/fontawesome/fa-light-300.woff2", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-light-300.woff2'));
});


app.get("/fonts/fontawesome/fa-regular-400.eot", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-regular-400.eot'));
});

app.get("/fonts/fontawesome/fa-regular-400.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-regular-400.svg'));
});

app.get("/fonts/fontawesome/fa-regular-400.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-regular-400.ttf'));
});

app.get("/fonts/fontawesome/fa-regular-400.woff", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-regular-400.woff'));
});

app.get("/fonts/fontawesome/fa-regular-400.woff2", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-regular-400.woff2'));
});


app.get("/fonts/fontawesome/fa-solid-900.eot", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-solid-900.eot'));
});

app.get("/fonts/fontawesome/fa-solid-900.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-solid-900.svg'));
});

app.get("/fonts/fontawesome/fa-solid-900.ttf", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-solid-900.ttf'));
});

app.get("/fonts/fontawesome/fa-solid-900.woff", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-solid-900.woff'));
});

app.get("/fonts/fontawesome/fa-solid-900.woff2", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/fonts/fontawesome/fa-solid-900.woff2'));
});


/*
    get images
*/

app.get("/images/logo.ico", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/logo.ico'));
});

app.get("/images/logo_colored.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/logo_colored.svg'));
});

app.get("/images/logo.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/logo.svg'));
});

app.get("/images/m1.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/m1.svg'));
});

app.get("/images/robot.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/robot.svg'));
});

app.get("/images/m2.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/m2.svg'));
});

app.get("/images/m3.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/m3.svg'));
});

app.get("/images/m4.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/m4.svg'));
});

app.get("/images/signin.png", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/signin.png'));
});

app.get("/images/signup.png", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/signup.png'));
});

app.get("/images/uros.jpg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/uros.jpg'));
});

app.get("/images/completed.svg", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/images/completed.svg'));
});

/*

    get scripts

*/

app.get("/js/scroll.js", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/js/scroll.js'));
});

/*

    404
    
*/

app.get('*', function(req, res){
    res.status(404).render(path.join(__dirname + '/views/error/error.ejs'), { errCode: 404, errMessage: "Page not found" });
});