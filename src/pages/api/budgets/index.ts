
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Budget } from '@/types';
import { generateId } from '@/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('budgets');

  if (req.method === 'GET') {
    const budgets = await collection.find({}).toArray();
    return res.status(200).json(budgets);
  } 
  
  if (req.method === 'POST') {
    const budget = req.body as Omit<Budget, 'id'>;
    
    // Check if budget for this category and month already exists
    const existingBudget = await collection.findOne({ 
      categoryId: budget.categoryId, 
      month: budget.month 
    });
    
    if (existingBudget) {
      // Update existing budget instead of creating a new one
      await collection.updateOne(
        { _id: existingBudget._id },
        { $set: { amount: budget.amount } }
      );
      return res.status(200).json({
        ...existingBudget,
        amount: budget.amount
      });
    }
    
    // Create new budget
    const newBudget = { ...budget, id: generateId() };
    await collection.insertOne(newBudget);
    return res.status(201).json(newBudget);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
