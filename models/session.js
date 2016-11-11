let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let sessionSchema = new Schema({
  date: {type:Date, default:Date.now},
  workout : { type: Schema.Types.ObjectId, ref: 'Workout' },
  sets : [{ type: Schema.Types.ObjectId, ref: 'Set' }],
  notes : { type: String }
});

module.exports = mongoose.model('Session', sessionSchema);