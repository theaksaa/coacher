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
        else console.log("error with finding user");
    } catch (e) {
        return res.status(500).json({ message: "Server error " + e });
    }
});


router.post("/exercise/add", adminauth, async (req, res) => {

    const { name, _difficulty, image, script, _kcal, _timeRequired } = req.body;
    var difficulty = parseInt(_difficulty, 10);
    var kcal = parseInt(_kcal, 10);
    var timeRequired = parseFloat(_timeRequired).toFixed(2);

    try {
        if(name.length == 0) return res.status(400).json({ message: "Name must have at least one character!" });
        if(name.length > 20) return res.status(400).json({ message: "Name can't be longer than 20 characters!" });
        if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(name)) return res.status(400).json({ message: "Name isn't valid!" });

        if(kcal <= 0) return res.status(400).json({ message: "kcal can't be smaller than 0" });
        if(timeRequired <= 0) return res.status(400).json({ message: "Time required can't be smaller than 0" });

        if(difficulty == 1 || difficulty == 2 || difficulty == 3) {
            let exercise = new Exercise({ name, difficulty, image, createdAt: new Date().getTime(), script, kcal, timeRequired });
            await exercise.save();

            //res.status(200).json({ redirect: '/admin' });
            logger.log("INFO", "\x1b[32m", "Exercise created", "id", exercise.id, "name", name);
            return res.status(500).json({ message: "Exercise created" });

        } else return res.status(400).json({ message: "Difficulty must be 1, 2 or 3!" });

    } catch (err) {
        return res.status(500).json({ message: "Server error, try again later..." });
    }
});

router.post("/exercise/edit", adminauth, async (req, res) => {

    const { id, name, _difficulty, image, script, _kcal, _timeRequired } = req.body;
    var difficulty = parseInt(_difficulty, 10);
    var kcal = parseInt(_kcal, 10);
    var timeRequired = parseFloat(_timeRequired).toFixed(2);

    try { 
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Not Valid ID!" });
        const exercise = await Exercise.findById(id);
        if(!exercise) return res.status(400).json({ message: "Exercise not exist" });

        if(name !== null && name !== undefined && name !== "") {
            if(name.length == 0) return res.status(400).json({ message: "Name must have at least one character!" });
            if(name.length > 20) return res.status(400).json({ message: "Name can't be longer than 20 characters!" });
            if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(name)) return res.status(400).json({ message: "Name isn't valid!" });
            exercise.name = name;
        }

        if(difficulty !== null && difficulty !== undefined && !Number.isNaN(difficulty)) {
            if(difficulty !== 1 && difficulty !== 2 && difficulty !== 3) return res.status(400).json({ message: "Difficulty must be 1, 2 or 3!" });
            exercise.difficulty = difficulty;
        }

        if(image !== null && image !== undefined && image !== "") {
            exercise.image = image;
        }

        if(script !== null && script !== undefined && script !== "") {
            exercise.script = script;
        }

        if(kcal !== null && kcal !== undefined && !Number.isNaN(kcal)) {
            if(kcal <= 0) return res.status(400).json({ message: "kcal can't be smaller than 0" });
            exercise.kcal = kcal;
        }

        if(timeRequired !== null && timeRequired !== undefined && !Number.isNaN(timeRequired)) {
            if(timeRequired <= 0) return res.status(400).json({ message: "Time required can't be smaller than 0" });
            exercise.timeRequired = timeRequired;
        }
        
        await exercise.save();
        logger.log("INFO", "\x1b[32m", "Exercise edited", "id", exercise.id, "name", name);
        return res.status(500).json({ message: "Exercise edited" });
    } catch (err) {
        return res.status(500).json({ message: "Server error, try again later... " + err });
    }
});

router.post("/exercise/remove", adminauth, async (req, res) => {

    try {
        await Exercise.findOneAndDelete(req.body.id, function (err) {
            if(err) return res.status(500).json({ message: err });
            return res.status(200).json({ redirect: '/admin' });
        });
        
    } catch (err) {
        return res.status(500).json({ message: "Server error, try again later..." });
    }
});


module.exports = router;