var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var movieSchema = new Schema({
  title: { type: String, required: true },
  releaseYear: { type: String, required: true },
  director: { type: String, required: true },
  genre: { type: String, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);