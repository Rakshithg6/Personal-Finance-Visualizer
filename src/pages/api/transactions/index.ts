
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Transaction } from '@/types';
import { generateId } from '@/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('transactions');

  if (req.method === 'GET') {
    const transactions = await collection.find({}).sort({ date: -1 }).toArray();
    return res.status(200).json(transactions);
  } 
  
  if (req.method === 'POST') {
    const transaction = req.body as Omit<Transaction, 'id'>;
    const newTransaction = { ...transaction, id: generateId() };
    await collection.insertOne(newTransaction);
    return res.status(201).json(newTransaction);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
