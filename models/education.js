import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, 'Please provide a degree or course name'],
    trim: true,
  },
  institution: {
    type: String,
    required: [true, 'Please provide an institution name'],
    trim: true,
  },
  period: {
    type: String,
    required: [true, 'Please provide a time period'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
EducationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Education=mongoose.models.Education||mongoose.model('Education',EducationSchema);
export default Education;