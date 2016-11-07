let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let workoutSchema = new Schema({
  // movement_id : { type: String, required: true },
  // numSets : { type: Number, required: true },
  // repRange : { type: String, required: true }
});

module.exports = mongoose.model('Workout', workoutSchema);