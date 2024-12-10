const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema(
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
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;