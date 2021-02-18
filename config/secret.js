const fs = require('fs');
const logger = require('../logger/logger');

function randomToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+][\\\';/.,';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const GenerateToken = () => {
    var tokenSecret = randomToken(32);

    fs.writeFile('secret', tokenSecret, function (err) {
        if (err) return logger.log("ERROR", "\x1b[31m", "error", err);
        logger.log("INFO", "\x1b[32m", "Token secret created", 'token', tokenSecret);
    });
};

module.exports = GenerateToken;