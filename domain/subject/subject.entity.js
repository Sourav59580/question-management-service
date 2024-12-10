const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
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

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;