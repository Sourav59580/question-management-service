const mongoose = require('mongoose');

const difficultyLevelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Difficultylevel = mongoose.model('DifficultyLevel', difficultyLevelSchema);

module.exports = Difficultylevel;