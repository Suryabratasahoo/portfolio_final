import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    maxlength: [60, 'Skill name cannot be more than 60 characters'],
  },
  icon: {
    type: String,
    required: [true, 'Please provide an icon URL'],
  },
  level: {
    type: Number,
    required: [true, 'Please provide a skill level'],
    min: [0, 'Level cannot be less than 0'],
    max: [100, 'Level cannot be more than 100'],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category ID'],
  },
}, {
  timestamps: true,
})

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema)