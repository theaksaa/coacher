const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require('../middleware/auth');
const User = require("../model/User");
const Exercise = require("../model/Exercise");
const path = require('path');
const emailRegex = require('email-regex');
const moment = require('moment');
const logger = require('../logger/logger');
const fs = require('fs');

var tokenSecret = fs.readFileSync('secret', 'utf-8', 'r');

router.post("/signup", async (req, res) => {

    const { name, email, password, confirmPassword, checkToS } = req.body;

    try {
        if(name.length == 0) return res.status(400).json({ message: "Name must have at least one character!" });
        if(name.length > 20) return res.status(400).json({ message: "Name can't be longer than 20 characters!" });
        if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(name)) return res.status(400).json({ message: "Name isn't valid!" });

        if(!emailRegex({exact: true}).test(email)) return res.status(400).json({ message: "Entered email address is not valid!" });

        if(password.length < 8) return res.status(400).json({ message: "Password must have at least 8 characters!" });
        if(password.length > 24) return res.status(400).json({ message: "Password can't be longer than 24 characters!" });
        if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,24}$/g.test(password)) return res.status(400).json({ message: "Password must have at least 8 characters containing one: upper case, lower case, number and special character (!@#$%^&*)!" });

        if(password != confirmPassword) return res.status(400).json({ message: "Password are different!" });

        if(!(checkToS === "true")) return res.status(400).json({ message: "You must agree to the <a href=\"terms\" class=\"stretched-link font-weight-bold\" style=\"position: relative;\">Terms of service</a>" });

        if (await User.findOne({ email })) return res.status(400).json({ message: "Entered email address is already in use!" });

        let user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            },
            creationDate: new Date().getTime()
        };

        jwt.sign(payload, tokenSecret, { expiresIn: 10800 }, (err, token) => {
            if (err) throw err;
            res.cookie('auth', token);
            res.status(200).json({ redirect: '/user' });
        });

        logger.log("INFO", "\x1b[32m", "User registered", "userid", user.id, "ip", req.ip);
    } catch (e) {
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.post("/changepass", auth, async (req, res) => {
    const { password, cpassword, oldpassword } = req.body;
    const user = await User.findById(req.user.id);
    if(user) {
        try {

            if(password !== cpassword) return res.status(400).json({ message: "Passwords aren't same!" });
    
            if(password.length < 8) return res.status(400).json({ message: "Password must have at least 8 characters!" });
            if(password.length > 24) return res.status(400).json({ message: "Password can't be longer than 24 characters!" });
            if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,24}$/g.test(password)) return res.status(400).json({ message: "Password must have at least 8 characters containing one: upper case, lower case, number and special character (!@#$%^&*)!" });
    
            if (!(await bcrypt.compare(oldpassword, user.password))) return res.status(400).json({ message: "Incorrect password!" });
    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.lastChangeActivity = new Date().getTime();
    
            await user.save();
    
            const payload = {
                user: {
                    id: user.id
                },
                creationDate: new Date().getTime()
            };
    
            jwt.sign(payload, tokenSecret, { expiresIn: 10800 }, (err, token) => {
                if (err) throw err;
                res.cookie('auth', token);
                return res.status(200).json({ message: "Password changed!" });
            });
            logger.log("INFO", "\x1b[32m", "User changed password", "userid", user.id, "ip", req.ip);
        } catch (e) {
            return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
        }
    }
    else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
});

router.post("/changeprofile", auth, async (req, res) => {
    const { name, weekGoal } = req.body;
    const weekGoalInt = parseInt(weekGoal, 10);
    const user = await User.findById(req.user.id);
    if(user) {
        try {

            if(name !== "") {
                if(name.length == 0) return res.status(400).json({ message: "Name must have at least one character!" });
                if(name.length > 20) return res.status(400).json({ message: "Name can't be longer than 20 characters!" });
                if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(name)) return res.status(400).json({ message: "Name isn't valid!" });
            }
    
            if(weekGoal !== "") {
                if(weekGoalInt < 1 || weekGoalInt > 7) return res.status(400).json({ message: "Week goal can be from 1 to 7!" });
            }
    
            user.name = name !== "" ? name : user.name;
            user.weekGoal = weekGoal !== "" ? weekGoalInt : user.weekGoal;
            user.lastChangeActivity = new Date().getTime();
    
            await user.save();
    
            const payload = {
                user: {
                    id: user.id
                },
                creationDate: new Date().getTime()
            };
    
            jwt.sign(payload, tokenSecret, { expiresIn: 10800 }, (err, token) => {
                if (err) throw err;
                res.cookie('auth', token);
                return res.status(200).json({ message: "Profile settings changed!" });
            });
            logger.log("INFO", "\x1b[32m", "User changed profile settings", "userid", user.id, "ip", req.ip);
        } catch (e) {
            return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
        }
    }
    else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
});

router.post( "/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User Not Exist" });
        if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Incorrect Password !" });

        user.lastactivity = new Date().getTime();
        await user.save();

        const payload = { 
            user: {
                id: user.id
            },
            creationDate: new Date().getTime()
        };

        jwt.sign(payload, tokenSecret, { expiresIn: 86400 }, (err, token) => {
            if (err) throw err;
            res.cookie('auth', token);
            res.status(200).json({ redirect: '/user' });
        });

        logger.log("INFO", "\x1b[32m", "User logged in", "userid", user.id, "ip", req.ip);

    } catch (e) {
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const exercisesarr = await Exercise.find();

        var exercises = exercisesarr.reduce(function(map, obj) {
            map[obj.id] = obj;
            return map;
        }, {});

        if (user) res.render(path.join(__dirname + '/../views/user/index.ejs'), { name: user.name, email: user.email, image: user.image, isAdmin: user.admin, exercises: exercises, userExercises: user.exercises, weekGoal: user.weekGoal, moment: moment });
        else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
    } catch (e) {
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.get("/settings", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) res.render(path.join(__dirname + '/../views/user/settings.ejs'), { name: user.name, email: user.email, image: user.image, isAdmin: user.admin, weekGoal: user.weekGoal, moment: moment });
        else return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "User not found" });
    } catch (e) {
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

router.get("/logout", auth, async (req, res) => {
    try {
        res.cookie('auth', null);
        res.redirect('/');
        //res.status(200).json({ redirect: '/' });
        logger.log("INFO", "\x1b[32m", "User logged out", "userid", req.user.id, "ip", req.ip);
    } catch (e) {
        return res.status(500).render(path.join(__dirname + '/../views/error/error.ejs'), { errCode: 500, errMessage: "Server error: " + e });
    }
});

module.exports = router;