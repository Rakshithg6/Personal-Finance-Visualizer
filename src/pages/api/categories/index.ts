
import { NextApiRequest, NextApiResponse } from 'next';
import { categories } from '@/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Return the predefined categories
      return res.status(200).json(categories);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("API error:", error);
    // Return a fallback response to prevent client-side errors
    return res.status(500).json({ 
      message: 'Internal server error',
      fallback: categories // Return default categories as fallback
    });
  }
}
