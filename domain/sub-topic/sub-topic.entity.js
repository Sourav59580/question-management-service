const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subtopicSchema = new Schema(
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
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subtopic = mongoose.model('Subtopic', subtopicSchema);

module.exports = Subtopic;
