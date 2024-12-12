const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionLogSchema = new Schema(
    {
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        action: {
            type: String,
            enum: ['created', 'updated', 'deleted'],
            required: true,
        },
        details: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const QuestionLog = mongoose.model('QuestionLog', questionLogSchema);

module.exports = QuestionLog;