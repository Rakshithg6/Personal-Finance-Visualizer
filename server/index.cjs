const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Transaction = require('./models/Transaction.cjs');
const Category = require('./models/Category.cjs');
const Budget = require('./models/Budget.cjs');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- Transaction Routes ---
app.get('/api/transactions', async (req, res) => {
  const txs = await Transaction.find();
  res.json(txs.map(tx => ({ ...tx.toObject(), id: tx._id.toString() })));
});

app.post('/api/transactions', async (req, res) => {
  const tx = new Transaction(req.body);
  await tx.save();
  res.json({ ...tx.toObject(), id: tx._id.toString() });
});

app.delete('/api/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// --- Category Routes ---
app.get('/api/categories', async (req, res) => {
  res.json(await Category.find());
});

app.post('/api/categories', async (req, res) => {
  const cat = new Category(req.body);
  await cat.save();
  res.json(cat);
});

// --- Budget Routes ---
app.get('/api/budgets', async (req, res) => {
  res.json(await Budget.find());
});

app.post('/api/budgets', async (req, res) => {
  const budget = new Budget(req.body);
  await budget.save();
  res.json(budget);
});

app.delete('/api/budgets/:id', async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
