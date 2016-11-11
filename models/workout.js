let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let workoutSchema = new Schema({
  name : { type: String, required: true },
  workoutMovements : [{type: Schema.Types.ObjectId, ref: 'WorkoutMovement'}]
});

module.exports = mongoose.model('Workout', workoutSchema);