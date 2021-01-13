const jwt = require("jsonwebtoken");
const User = require("../model/User");
const fs = require('fs');

var tokenSecret = fs.readFileSync('secret', 'utf-8', 'r');

module.exports = async function(req, res, next) {
    const token = req.cookies.auth;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, tokenSecret);
        var lactivity = Date.parse((await User.findById(decoded.user.id)).lastchangeactivity);
        var tokenCreationDate = decoded.creationDate;
        if(tokenCreationDate < lactivity || tokenCreationDate === undefined || lactivity === undefined || tokenCreationDate === null || lactivity === null) {
            res.cookie('auth', null);
            return res.redirect('/login');
        }
        req.user = decoded.user;
        next();
    } catch (e) {
        return res.redirect('/login');
    }
};