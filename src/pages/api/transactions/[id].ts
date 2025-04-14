
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Transaction } from '@/types';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('transactions');
  const { id } = req.query;

  if (req.method === 'PUT') {
    const transaction = req.body as Transaction;
    // Don't try to update MongoDB's _id
    const { _id, ...transactionData } = transaction as any;
    await collection.updateOne({ id }, { $set: transactionData });
    return res.status(200).json(transaction);
  }
  
  if (req.method === 'DELETE') {
    await collection.deleteOne({ id });
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const transaction = await collection.findOne({ id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json(transaction);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
