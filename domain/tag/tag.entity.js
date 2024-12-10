const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
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

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;