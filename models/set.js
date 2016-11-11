let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let movementSchema = new Schema({
  name : { type: String, required: true }
});

module.exports = mongoose.model('Movement', movementSchema);