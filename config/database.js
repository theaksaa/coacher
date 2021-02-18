const mongoose = require("mongoose");
const logger = require('../logger/logger');

module.exports = async (uri = "mongodb://localhost:27017/coacher") => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000
        });
        logger.log("INFO", "\x1b[32m", "MongoDB connected", "uri", "'" + uri + "'");
    } catch (err) {
        logger.log("ERROR", "\x1b[31m", "MongoDB connection failed", "err", "'" + err + "'", "uri", "'" + uri + "'");
        process.exit(0);
        //throw e;
    }
};