import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  color: String,
  details: String,
  title: String,
  description: String,
  status: String,
  icon: String,
  timeframe: String,
  category: String,
  bgColor: String,
});

export const Timeline = mongoose.models.Timeline || mongoose.model('Timeline', timelineSchema);
export default Timeline;