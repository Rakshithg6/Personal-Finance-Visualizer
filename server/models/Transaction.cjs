const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  date: String, // ISO date string
  description: String,
  categoryId: String,
});

module.exports = mongoose.model('Transaction', TransactionSchema);
