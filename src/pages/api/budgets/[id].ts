
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Budget } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('budgets');
  const { id } = req.query;

  if (req.method === 'PUT') {
    const budget = req.body as Budget;
    delete budget._id; // Remove MongoDB's _id if it exists
    await collection.updateOne({ id }, { $set: budget });
    return res.status(200).json(budget);
  }
  
  if (req.method === 'DELETE') {
    await collection.deleteOne({ id });
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
