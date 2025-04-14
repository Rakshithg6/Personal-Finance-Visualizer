
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Budget } from '@/types';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('budgets');
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (req.method === 'PUT') {
      const budget = req.body as Budget;
      // Don't try to update MongoDB's _id
      const { _id, ...budgetData } = budget as any;
      await collection.updateOne({ id }, { $set: budgetData });
      return res.status(200).json(budget);
    }
    
    if (req.method === 'DELETE') {
      await collection.deleteOne({ id });
      return res.status(204).end();
    }

    if (req.method === 'GET') {
      const budget = await collection.findOne({ id });
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      return res.status(200).json(budget);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
