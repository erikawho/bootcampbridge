const mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = exports = mongoose.model('Student', studentSchema);
