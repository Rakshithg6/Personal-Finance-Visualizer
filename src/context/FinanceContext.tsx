
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, Category, Budget } from "@/types";
import { generateId, categories as defaultCategoriesData, sampleTransactions, sampleBudgets } from "@/lib/data";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  editTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, "id">) => Promise<void>;
  editBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<Category | null>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Always merge backend and default categories, no duplicates by name
  const [categories, setCategories] = useState<Category[]>([...defaultCategoriesData]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from backend API (MongoDB)
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [catRes, txRes, budgetRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/api/transactions`),
          fetch(`${import.meta.env.VITE_API_URL}/api/budgets`),
        ]);
        // Merge backend categories with defaults, no duplicates by name
        const backendCats = await catRes.json();
        const mergedCats = [
          ...defaultCategoriesData.filter(def => !backendCats.some((cat: Category) => cat.id === def.id)),
          ...backendCats
        ];
        setCategories(mergedCats);
        const txs = await txRes.json();
        setTransactions(
          txs.map((tx: any) => ({
            ...tx,
            id: tx.id || tx._id || '',
          }))
        );
        setBudgets(await budgetRes.json());
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load from backend.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      // Always use categoryId as id (never _id)
      const cleanTx = { ...transaction, categoryId: transaction.categoryId };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanTx),
      });
      const newTx = await res.json();
      setTransactions([newTx, ...transactions]);
      toast({
        title: 'Transaction Added',
        description: 'Your transaction has been successfully added.',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const editTransaction = async (transaction: Transaction) => {
    try {
      // For simplicity, delete and re-add (or implement PUT in backend for full update)
      await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${transaction.id}`, { method: 'DELETE' });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      const newTx = await res.json();
      setTransactions(transactions.map(t => t.id === transaction.id ? { ...newTx, id: newTx.id || newTx._id || transaction.id } : t));
      toast({
        title: 'Transaction Updated',
        description: 'Your transaction has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, { method: 'DELETE' });
      setTransactions(prev => prev.filter((t) => t.id !== id));
      toast({
        title: 'Transaction Deleted',
        description: 'Your transaction has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addBudget = async (budget: Omit<Budget, "id">) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      const newBudget = await res.json();
      setBudgets([newBudget, ...budgets]);
      toast({
        title: 'Budget Added',
        description: 'Your budget has been successfully added.',
      });
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to add budget. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const editBudget = async (budget: Budget) => {
    try {
      // For simplicity, delete and re-add (or implement PUT in backend for full update)
      await fetch(`${import.meta.env.VITE_API_URL}/api/budgets/${budget.id}`, { method: 'DELETE' });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      const newBudget = await res.json();
      setBudgets([newBudget, ...budgets.filter(b => b.id !== budget.id)]);
      toast({
        title: 'Budget Updated',
        description: 'Your budget has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to update budget. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/budgets/${id}`, { method: 'DELETE' });
      setBudgets(budgets.filter(b => b.id !== id));
      toast({
        title: 'Budget Deleted',
        description: 'Your budget has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete budget. Please try again.',
        variant: 'destructive',
      });
    }
  };


  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      const newCategory = await res.json();
      // Ensure no duplicate names when adding new category
      setCategories(prev => {
        if (prev.some(cat => cat.name === newCategory.name)) return prev;
        return [...prev, newCategory];
      });
      toast({
        title: 'Category Added',
        description: 'Your category has been successfully added.',
      });
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const value = {
    transactions,
    categories,
    budgets,
    isLoading,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addBudget,
    editBudget,
    deleteBudget,
    addCategory,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
