
import { Transaction, Category, Budget } from "@/types";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

// Predefined categories
export const categories: Category[] = [
  { id: "1", name: "Food & Dining", color: "#60a5fa", icon: "utensils" },
  { id: "2", name: "Transportation", color: "#34d399", icon: "car" },
  { id: "3", name: "Housing", color: "#a78bfa", icon: "home" },
  { id: "4", name: "Entertainment", color: "#f87171", icon: "film" },
  { id: "5", name: "Shopping", color: "#fbbf24", icon: "shopping-bag" },
  { id: "6", name: "Healthcare", color: "#22d3ee", icon: "heart-pulse" },
  { id: "7", name: "Personal Care", color: "#f472b6", icon: "scissors" },
  { id: "8", name: "Education", color: "#6366f1", icon: "book" },
  { id: "9", name: "Investments", color: "#10b981", icon: "trending-up" },
  { id: "10", name: "Income", color: "#10b981", icon: "wallet" },
  { id: "11", name: "Other", color: "#9ca3af", icon: "more-horizontal" },
];

// Generate some sample transactions
export const sampleTransactions: Transaction[] = [
  {
    id: "t1",
    amount: -2500,
    date: subDays(new Date(), 2).toISOString(),
    description: "Grocery Shopping",
    categoryId: "1",
  },
  {
    id: "t2",
    amount: -1800,
    date: subDays(new Date(), 4).toISOString(),
    description: "Gas Station",
    categoryId: "2",
  },
  {
    id: "t3",
    amount: -18000,
    date: startOfMonth(new Date()).toISOString(),
    description: "Monthly Rent",
    categoryId: "3",
  },
  {
    id: "t4",
    amount: -800,
    date: subDays(new Date(), 6).toISOString(),
    description: "Movie Tickets",
    categoryId: "4",
  },
  {
    id: "t5",
    amount: -3000,
    date: subDays(new Date(), 10).toISOString(),
    description: "New Shirt and Pants",
    categoryId: "5",
  },
  {
    id: "t6",
    amount: -2500,
    date: subDays(new Date(), 15).toISOString(),
    description: "Doctor's Visit",
    categoryId: "6",
  },
  {
    id: "t7",
    amount: -800,
    date: subDays(new Date(), 8).toISOString(),
    description: "Haircut",
    categoryId: "7",
  },
  {
    id: "t8",
    amount: -15000,
    date: subDays(new Date(), 20).toISOString(),
    description: "Online Course",
    categoryId: "8",
  },
  {
    id: "t9",
    amount: -20000,
    date: subDays(new Date(), 25).toISOString(),
    description: "Stock Purchase",
    categoryId: "9",
  },
  {
    id: "t10",
    amount: 50000,
    date: startOfMonth(new Date()).toISOString(),
    description: "Salary",
    categoryId: "10",
  },
  {
    id: "t11",
    amount: -300,
    date: subDays(new Date(), 3).toISOString(),
    description: "Lunch",
    categoryId: "1",
  },
  {
    id: "t12",
    amount: -1200,
    date: subDays(new Date(), 7).toISOString(),
    description: "Tank of Gas",
    categoryId: "2",
  },
  {
    id: "t13",
    amount: -500,
    date: subDays(new Date(), 5).toISOString(),
    description: "Netflix Subscription",
    categoryId: "4",
  },
  {
    id: "t14",
    amount: -4500,
    date: subDays(new Date(), 12).toISOString(),
    description: "Running Shoes",
    categoryId: "5",
  },
  {
    id: "t15",
    amount: -800,
    date: subDays(new Date(), 9).toISOString(),
    description: "Vitamins",
    categoryId: "6",
  },
];

// Sample budget data
export const sampleBudgets: Budget[] = [
  { id: "b1", categoryId: "1", amount: 8000, month: format(new Date(), "yyyy-MM") },
  { id: "b2", categoryId: "2", amount: 5000, month: format(new Date(), "yyyy-MM") },
  { id: "b3", categoryId: "3", amount: 20000, month: format(new Date(), "yyyy-MM") },
  { id: "b4", categoryId: "4", amount: 3000, month: format(new Date(), "yyyy-MM") },
  { id: "b5", categoryId: "5", amount: 5000, month: format(new Date(), "yyyy-MM") },
  { id: "b6", categoryId: "6", amount: 3000, month: format(new Date(), "yyyy-MM") },
  { id: "b7", categoryId: "7", amount: 2000, month: format(new Date(), "yyyy-MM") },
  { id: "b8", categoryId: "8", amount: 5000, month: format(new Date(), "yyyy-MM") },
  { id: "b9", categoryId: "9", amount: 10000, month: format(new Date(), "yyyy-MM") },
];

// Helper functions
export const getCategoryById = (id: string, categoriesArray: Category[] = categories): Category => {
  return categoriesArray.find((cat) => cat.id === id) || categoriesArray[categoriesArray.length - 1];
};

export const getMonthlyTransactions = (date: Date = new Date(), transactions: Transaction[] = []): Transaction[] => {
  if (!Array.isArray(transactions)) return [];
  
  const start = startOfMonth(date).getTime();
  const end = endOfMonth(date).getTime();
  
  return transactions.filter((transaction) => {
    const transactionTime = new Date(transaction.date).getTime();
    return transactionTime >= start && transactionTime <= end;
  });
};

export const getCategoryTotal = (categoryId: string, transactions: Transaction[] = []): number => {
  if (!Array.isArray(transactions)) return 0;
  
  return transactions
    .filter((t) => t.categoryId === categoryId)
    .reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
};

export const getBudgetByCategory = (categoryId: string, month: string, budgets: Budget[] = []): Budget | undefined => {
  if (!Array.isArray(budgets)) return undefined;
  
  return budgets.find((b) => b.categoryId === categoryId && b.month === month);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
