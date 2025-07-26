import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Please provide a role/position'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
  },
  period: {
    type: String,
    required: [true, 'Please provide a time period'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
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
ExperienceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Experience = 
  mongoose.models.Experience || 
  mongoose.model('Experience', ExperienceSchema);

export default Experience;