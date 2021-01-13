const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const User = require("../model/User");
const path = require('path');
const moment = require('moment');
const logger = require('../logger/logger');
const Exercise = require("../model/Exercise");
const mongoose = require('mongoose');

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            if(!mongoose.Types.ObjectId.isValid(req.query.id)) return res.status(500).json({ message: "ERROR ID "});

            const exercise = await Exercise.findById(req.query.id);
            if(exercise) res.render(path.join(__dirname + '/../views/exercise/index.ejs'), { name: user.name, exercise: exercise, moment: moment });
            else return res.status(500).json({ message: "ERROR with finding exercise ID "});
        }
        else return res.status(500).json({ message: "ERROR with finding user! "});
    } catch (e) {
        return res.status(500).json({ message: "Server error " + e });
    }
});

module.exports = router;