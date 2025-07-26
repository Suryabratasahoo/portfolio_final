import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a certification name'],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, 'Please provide an issuing organization'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Please provide a date or year of certification'],
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
CertificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});



export const Certification=mongoose.models.Certification||mongoose.model('Certification',CertificationSchema);
export default Certification;