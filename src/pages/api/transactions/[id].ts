
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Transaction } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('transactions');
  const { id } = req.query;

  if (req.method === 'GET') {
    const transaction = await collection.findOne({ id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json(transaction);
  } 
  
  if (req.method === 'PUT') {
    const transaction = req.body as Transaction;
    delete transaction._id; // Remove MongoDB's _id if it exists
    await collection.updateOne({ id }, { $set: transaction });
    return res.status(200).json(transaction);
  }
  
  if (req.method === 'DELETE') {
    await collection.deleteOne({ id });
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
