
export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO date string
  description: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';
