const mongoose = require("mongoose");

const ExerciseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        required: true,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastChangeActivity: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    script: {
        type: String,
        required: true,
        default: null
    }
});

// export model exercise with ExerciseSchema
module.exports = mongoose.model("exercise", ExerciseSchema);