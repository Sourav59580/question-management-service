const mongoose = require('mongoose');
const QuestionStatus = require('./enums/question-status.enum');
const { Schema } = mongoose;

const optionSchema = new Schema(
    {
        option: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
    },
    { _id: false }
);

const comprehensionOptionSchema = new Schema(
    {
        question: { type: String, required: true },
        options: [optionSchema],
    },
    { _id: false }
);

const optionsSchema = new Schema(
    {
        mcq: {
            type: Map,
            of: [optionSchema],
            required: true,
        },
        comprehension: {
            type: Map,
            of: [comprehensionOptionSchema],
            required: true,
        },
    },
    { _id: false }
);

const questionSchema = new Schema(
    {
        QID: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ['mcq', 'comprehension'],
            required: true,
        },
        language: {
            type: [String],
            required: true,
        },
        questionCode1: {
            type: String,
            required: true,
            match: /^[A-Za-z]{3}\d{4}$/,
        },
        questionCode2: {
            type: String,
            required: true,
            match: /^[A-Za-z]{3}\d{4}$/,
        },
        examinationId: {
            type: Schema.Types.ObjectId,
            ref: 'Examination',
            required: true,
        },
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: true,
        },
        subTopic: {
            type: Schema.Types.ObjectId,
            ref: 'Subtopic',
            required: true,
        },
        difficultyLevel: {
            type: Schema.Types.ObjectId,
            ref: 'DifficultyLevel',
            required: true,
        },
        level: {
            type: Schema.Types.ObjectId,
            ref: 'Level',
            required: true,
        },
        userCode: {
            type: String,
            required: true,
        },
        questionStatus: {
            type: String,
            enum: Object.values(QuestionStatus),
            default: 'creation',
        },
        changeStatus: {
            type: String,
            select: false,
        },
        question: {
            type: Map,
            of: String,
        },
        options: {
            type: optionsSchema,
            required: true
        },
        reviewer: [{
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            date: { type: Date, default: Date.now },
        }],
        assignedUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        tags: {
            type: [String],
            required: false,
        },
        slug: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true
    }
);

questionSchema.pre('save', async function (next) {
    this.slug = this.tags.length > 0 ? this.tags.join('-') : 'untagged';
    next();
});

questionSchema.methods.getOptionsByLanguage = function (language) {
    return this.options.get(language) || [];
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;