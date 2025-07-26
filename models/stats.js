import mongoose from 'mongoose';

const statsSchema=new mongoose.Schema({
    id:{type:Number,required:true},
    icon:{type:String,required:true},
    value:{type:Number,required:true},
    suffix:{type:String},
    label:{type:String,required:true},
    color:{type:String,required:true},
})

export const Stats=mongoose.models.Stats||mongoose.model('Stats',statsSchema);
export default Stats;