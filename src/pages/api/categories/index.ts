
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Category } from '@/types';
import { categories } from '@/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('categories');

  if (req.method === 'GET') {
    // Check if categories collection is empty
    const count = await collection.countDocuments();
    
    if (count === 0) {
      // If empty, seed with default categories
      await collection.insertMany(categories);
      return res.status(200).json(categories);
    }
    
    const allCategories = await collection.find({}).toArray();
    return res.status(200).json(allCategories);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
