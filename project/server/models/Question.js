import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    topic: {
      type: String,
      trim: true,
      default: '',
    },
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    askerName: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      trim: true,
      default: '',
    },
    answeredBy: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'answered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Question', questionSchema);
