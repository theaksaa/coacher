const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/coacher";
const logger = require('../logger/logger');

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        logger.log("INFO", "\x1b[32m", "MongoDB connected", "uri", "'" + uri + "'");
    } catch (err) {
        logger.log("ERROR", "\x1b[31m", "MongoDB connection failed", "err", "'" + err + "'", "uri", "'" + uri + "'");
        process.exit(0);
        //throw e;
    }
  };
  
  module.exports = InitiateMongoServer;