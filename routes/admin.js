const express = require("express");
const router = express.Router();
const adminauth = require('../middleware/adminauth');
const User = require("../model/User");
const Exercise = require("../model/Exercise");
const path = require('path');
const moment = require('moment');
const logger = require('../logger/logger');
const mongoose = require('mongoose');

router.get("/", adminauth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const exercisesarr = await Exercise.find();

        var exercises = exercisesarr.reduce(function(map, obj) {
            map[obj.id] = obj;
            return map;
        }, {});

        if (user) res.render(path.join(__dirname + '/../views/admin/index.ejs'), { name: user.name, exercises: exercises, moment: moment });
        else res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.get("/edit", adminauth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            if(!mongoose.Types.ObjectId.isValid(req.query.id)) return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Invalid exercise ID" });
    
            const exercise = await Exercise.findById(req.query.id);
            if(exercise) res.render(path.join(__dirname + '/../views/admin/edit.ejs'), { name: user.name, exercise: exercise, moment: moment });
            else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Exercise not found" });
        }
        else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.post("/exercise/add", adminauth, async (req, res) => {

    const { name, _difficulty, image, script, _kcal, _timeRequired, _repetitions } = req.body;
    var difficulty = parseInt(_difficulty, 10);
    var kcal = parseInt(_kcal, 10);
    var timeRequired = parseFloat(_timeRequired).toFixed(2);
    var repetitions = parseInt(_repetitions, 10);

    try {
        if(name.length == 0) return res.status(400).json({ message: "Name must have at least one character!", status: 401 });
        if(name.length > 20) return res.status(400).json({ message: "Name can't be longer than 20 characters!", status: 402 });
        if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(name)) return res.status(400).json({ message: "Name isn't valid!", status: 403 });

        if(kcal <= 0) return res.status(400).json({ message: "kcal can't be smaller than 0", status: 404 });
        if(timeRequired <= 0) return res.status(400).json({ message: "Time required can't be smaller than 0", status: 405 });
        if(script == "") return res.status(400).json({ message: "Script is required", status: 407 });
        if(repetitions <= 0 || repetitions >= 1000) return res.status(408).json({ message: "Repetitions can't be less than 0 and more than 1000" });

        if(difficulty == 1 || difficulty == 2 || difficulty == 3) {
            let exercise = new Exercise({ name, difficulty, image, createdAt: new Date().getTime(), script, kcal, timeRequired, repetitions });
            await exercise.save();

            logger.log("INFO", "\x1b[32m", "Exercise created", "id", exercise.id, "name", name);
            return res.status(200).json({ redirect: '/admin' });

        } else return res.status(400).json({ message: "Difficulty must be 1, 2 or 3!", status: 406 });

    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.post("/exercise/edit", adminauth, async (req, res) => {

    const { id, name, _difficulty, image, script, _kcal, _timeRequired, _repetitions } = req.body;
    var difficulty = parseInt(_difficulty, 10);
    var kcal = parseInt(_kcal, 10);
    var timeRequired = parseFloat(_timeRequired).toFixed(2);
    var repetitions = parseInt(_repetitions, 10);


    try { 
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Invalid exercise ID" });
        const exercise = await Exercise.findById(id);
        if(!exercise) return res.status(400).json({ message: "Exercise not exist", status: 400 });

        if(name !== null && name !== undefined && name !== "") {
            if(name.length == 0) return res.status(400).json({ message: "Name must have at least one character!", status: 401 });
            if(name.length > 20) return res.status(400).json({ message: "Name can't be longer than 20 characters!", status: 402 });
            if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(name)) return res.status(400).json({ message: "Name isn't valid!", status: 403 });
            exercise.name = name;
        }

        if(difficulty !== null && difficulty !== undefined && !Number.isNaN(difficulty)) {
            if(difficulty !== 1 && difficulty !== 2 && difficulty !== 3) return res.status(400).json({ message: "Difficulty must be 1, 2 or 3!", status: 406 });
            exercise.difficulty = difficulty;
        }

        if(image !== null && image !== undefined && image !== "") {
            exercise.image = image;
        }

        if(script !== null && script !== undefined && script !== "") {
            exercise.script = script;
        }

        if(kcal !== null && kcal !== undefined && !Number.isNaN(kcal)) {
            if(kcal <= 0) return res.status(400).json({ message: "kcal can't be smaller than 0", status: 404 });
            exercise.kcal = kcal;
        }

        if(timeRequired !== null && timeRequired !== undefined && !Number.isNaN(timeRequired)) {
            if(timeRequired <= 0) return res.status(400).json({ message: "Time required can't be smaller than 0", status: 405 });
            exercise.timeRequired = timeRequired;
        }

        if(repetitions !== null && repetitions !== undefined && !Number.isNaN(repetitions)) {
            if(repetitions <= 0 || repetitions >= 1000) return res.status(400).json({ message: "Repetitions can't be less than 0 and more than 1000", status: 408 });
            exercise.repetitions = repetitions;
        }
        
        await exercise.save();
        logger.log("INFO", "\x1b[32m", "Exercise edited", "id", exercise.id, "name", name);
        return res.status(200).json({ redirect: '/admin/edit/?id=' + exercise.id });
    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.post("/exercise/remove", adminauth, async (req, res) => {
    try {
        await Exercise.findByIdAndRemove(req.body.id, function (err) {
            if(err) return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + err });
            return res.status(200).json({ redirect: '/admin' });
        });
    } catch (e) {
        logger.log("ERROR", "\x1b[31m", "Server error", 'error', e);
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});


module.exports = router;