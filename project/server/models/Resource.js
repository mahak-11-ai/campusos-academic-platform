import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ['notes', 'previous-paper', 'assignment', 'reference'],
      required: true,
    },
    fileName: {
      type: String,
      default: '',
    },
    filePath: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ title: 'text', topic: 'text', description: 'text' });

export default mongoose.model('Resource', resourceSchema);
