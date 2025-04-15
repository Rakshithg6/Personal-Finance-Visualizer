const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: String,
  color: String,
  icon: String,
});

module.exports = mongoose.model('Category', CategorySchema);
