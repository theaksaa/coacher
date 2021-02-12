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
            if(!mongoose.Types.ObjectId.isValid(req.query.id)) return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Invalid exercise ID" });

            const exercise = await Exercise.findById(req.query.id);
            if(exercise) res.render(path.join(__dirname + '/../views/exercise/index.ejs'), { name: user.name, exercise: exercise, moment: moment });
            else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Exercise not found" });
        }
        else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.post("/finish", auth, async (req, res) => {
    try {
        const { id, timeStarted, timeElapsed } = req.body;
        const user = await User.findById(req.user.id);

        if (user) {
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Invalid exercise ID" });

            const exercise = await Exercise.findById(id);
            if(exercise) {
                user.exercises.push({ id: mongoose.Types.ObjectId(id), timeStarted: new Date(parseInt(timeStarted)), timeElapsed: parseFloat(timeElapsed).toFixed(2) });
                user.score += (exercise.timeRequired ** (exercise.difficulty / 10.0)) * 100;
                await user.save();

                return res.status(200).json({ message: "Saved" });
            }
            else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Exercise not found" });
        }
        else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

module.exports = router;