import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    maxlength: [60, 'Category name cannot be more than 60 characters'],
  },
  color: {
    type: String,
    required: [true, 'Please provide a color'],
    enum: ['blue', 'purple', 'pink', 'green', 'amber', 'indigo', 'rose'],
  },
}, {
  timestamps: true,
})

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)