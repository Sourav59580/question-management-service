const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
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

const Level = mongoose.model('Level', levelSchema);

module.exports = Level;