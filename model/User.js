const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastChangeActivity: {
        type: Date,
        default: Date.now()
    },
    lastActivity : {
        type: Date,
        default: Date.now()
    },
    exercises: [{
        id: {
            type: mongoose.Types.ObjectId,
            required: true,
            default: null
        },
        timeStarted: {
            type: Date,
            default: null,
        },
        timeElapsed: {
            type: mongoose.Types.Decimal128,
            default: null
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    weekGoal: {
        type: Number,
        default: 1
    },
    admin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: false,
        default: null
    }
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);