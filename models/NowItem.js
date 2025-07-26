import mongoose from 'mongoose';

const NowItemSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      enum: ['Code', 'BookOpen', 'Briefcase', 'Coffee', 'Music'],
      default: 'Code'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      enum: ['blue', 'purple', 'amber', 'green', 'pink', 'indigo', 'rose'],
      default: 'blue'
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['In Progress', 'Ongoing', 'Active', 'New', 'Planning', 'Completed'],
      default: 'New'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Check if model already exists (for Next.js hot reloading)
const NowItem = mongoose.models.NowItem || mongoose.model('NowItem', NowItemSchema);

export default NowItem;