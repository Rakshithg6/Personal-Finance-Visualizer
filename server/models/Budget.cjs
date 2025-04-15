const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  categoryId: String,
  amount: Number,
  month: String, // YYYY-MM
});

module.exports = mongoose.model('Budget', BudgetSchema);
