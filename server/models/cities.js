const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email : {type: String, required: true},
  cityname : String
});

module.exports = mongoose.model('Cities', userSchema);