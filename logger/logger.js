function datetime_now()
{
    let date = new Date();
    let day = date.getDate().toString().padStart(2, "0");
    let month = date.getMonth().toString().padStart(2, "0");
    let year = date.getFullYear().toString();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    let milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    return day + "-" + month + "-" + year + "|" + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

const fs = require("fs");
var log_file = fs.createWriteStream(__dirname + '/../logs.log', {flags : 'a'});

/// LOG
module.exports.log = function log(type, color, ...msg)
{
    var str = color + type.padEnd(5) + "\x1b[0m" + "[" + datetime_now() + "] " + msg[0].padEnd(46);
    for(var i = 1; i < msg.length; i++) {
        if(i % 2 != 0) str += color + msg[i] + "=\x1b[0m";
        else str += msg[i] + " ";
    }
    str += "\x1b[0m";
    console.log(str);
    log_file.write(str + '\n');
}