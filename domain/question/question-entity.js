const mongoose = require('mongoose');
const { encryptData, decryptData } = require('./encrypt-decrypt');
const QuestionStatus = require('./enums/question-status.enum');
const { Schema } = mongoose;

const optionSchema = new Schema(
    {
        option: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
    },
    { _id: false }
);

const generateQID = async () => {
    const lastQID = await Question.findOne().sort({ QID: -1 }).limit(1);
    return lastQID
        ? (parseInt(lastQID.QID) + 1).toString().padStart(15, '0')
        : '000000000000001';
};

const questionSchema = new Schema(
    {
        QID: {
            type: String,
            required: true,
            unique: true,
            default: generateQID,
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
        questionTitle: {
            type: Map,
            of: String,
            set: (v) => encryptData(JSON.stringify(v)),
            get: (v) => JSON.parse(decryptData(v)),
        },
        description: {
            type: Map,
            of: String,
            set: (v) => encryptData(JSON.stringify(v)),
            get: (v) => JSON.parse(decryptData(v)),
        },
        options: {
            type: Map,
            of: [optionSchema],
            required: true,
            set: (v) => encryptData(JSON.stringify(v)),
            get: (v) => JSON.parse(decryptData(v)),
        },
        correctAnswers: {
            type: Map,
            of: [String],
            required: true,
            set: (v) => encryptData(JSON.stringify(v)),
            get: (v) => JSON.parse(decryptData(v)),
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
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    }
);

questionSchema.pre('save', function (next) {
    this.slug = this.tags.join('-');
    next();
});

questionSchema.methods.getOptionsByLanguage = function (language) {
    return this.options.get(language) || [];
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;