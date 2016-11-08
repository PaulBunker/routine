let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let workoutMovementSchema = new Schema({
  movement : { type: Schema.Types.ObjectId, ref: 'movement', required: true },
  numSets : { type: Number, required: true },
  repRange : { type: String, required: true }
});

module.exports = mongoose.model('WorkoutMovement', workoutMovementSchema);