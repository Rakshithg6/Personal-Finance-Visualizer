
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, Category, Budget } from "@/types";
import { generateId } from "@/lib/data";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories first as other data depends on them
        const categoriesResponse = await axios.get('/api/categories');
        setCategories(categoriesResponse.data);
        
        // Fetch transactions and budgets in parallel
        const [transactionsResponse, budgetsResponse] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/budgets')
        ]);
        
        setTransactions(transactionsResponse.data || []);
        setBudgets(budgetsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your financial data.",
          variant: "destructive"
        });
        // Initialize with empty arrays if there's an error
        setTransactions([]);
        setBudgets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const response = await axios.post('/api/transactions', transaction);
      setTransactions((prev) => [response.data, ...prev]);
      toast({
        title: "Transaction Added",
        description: "Your transaction has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const editTransaction = async (transaction: Transaction) => {
    try {
      await axios.put(`/api/transactions/${transaction.id}`, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === transaction.id ? transaction : t))
      );
      toast({
        title: "Transaction Updated",
        description: "Your transaction has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Transaction Deleted",
        description: "Your transaction has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addBudget = async (budget: Omit<Budget, "id">) => {
    try {
      const response = await axios.post('/api/budgets', budget);
      setBudgets((prev) => {
        // Filter out any existing budget for this category and month
        const filtered = prev.filter(
          (b) => !(b.categoryId === budget.categoryId && b.month === budget.month)
        );
        return [...filtered, response.data];
      });
      toast({
        title: "Budget Added",
        description: "Your budget has been successfully set.",
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error",
        description: "Failed to add budget. Please try again.",
        variant: "destructive"
      });
    }
  };

  const editBudget = async (budget: Budget) => {
    try {
      await axios.put(`/api/budgets/${budget.id}`, budget);
      setBudgets((prev) =>
        prev.map((b) => (b.id === budget.id ? budget : b))
      );
      toast({
        title: "Budget Updated",
        description: "Your budget has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await axios.delete(`/api/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      toast({
        title: "Budget Deleted",
        description: "Your budget has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive"
      });
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
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
