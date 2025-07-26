import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  image: {
    type: String,
    default: '/placeholder.svg?height=400&width=600'
  },
  // Changed from cloudinaryId to filename for local storage
  filename: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  liveUrl: {
    type: String,
    default: '#'
  },
  githubUrl: {
    type: String,
    default: '#',
    required: [true, 'Please provide a GitHub URL']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
