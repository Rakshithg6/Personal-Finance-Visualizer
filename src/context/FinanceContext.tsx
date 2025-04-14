
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, Category, Budget } from "@/types";
import { generateId, categories, sampleTransactions, sampleBudgets } from "@/lib/data";
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

  // Load data from localStorage or use sample data
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        
        // Load categories from localStorage or use sample data
        const storedCategories = localStorage.getItem('financeCategories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          setCategories(categories);
          localStorage.setItem('financeCategories', JSON.stringify(categories));
        }
        
        // Load transactions from localStorage or use sample data
        const storedTransactions = localStorage.getItem('financeTransactions');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          setTransactions(sampleTransactions);
          localStorage.setItem('financeTransactions', JSON.stringify(sampleTransactions));
        }
        
        // Load budgets from localStorage or use sample data
        const storedBudgets = localStorage.getItem('financeBudgets');
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          setBudgets(sampleBudgets);
          localStorage.setItem('financeBudgets', JSON.stringify(sampleBudgets));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to sample data
        setCategories(categories);
        setTransactions(sampleTransactions);
        setBudgets(sampleBudgets);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = {
        ...transaction,
        id: generateId(),
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('financeTransactions', JSON.stringify(updatedTransactions));
      
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
      const updatedTransactions = transactions.map((t) => 
        t.id === transaction.id ? transaction : t
      );
      
      setTransactions(updatedTransactions);
      localStorage.setItem('financeTransactions', JSON.stringify(updatedTransactions));
      
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
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      
      setTransactions(updatedTransactions);
      localStorage.setItem('financeTransactions', JSON.stringify(updatedTransactions));
      
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
      const newBudget = {
        ...budget,
        id: generateId(),
      };
      
      // Filter out any existing budget for this category and month
      const filteredBudgets = budgets.filter(
        (b) => !(b.categoryId === budget.categoryId && b.month === budget.month)
      );
      
      const updatedBudgets = [...filteredBudgets, newBudget];
      setBudgets(updatedBudgets);
      localStorage.setItem('financeBudgets', JSON.stringify(updatedBudgets));
      
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
      const updatedBudgets = budgets.map((b) => 
        b.id === budget.id ? budget : b
      );
      
      setBudgets(updatedBudgets);
      localStorage.setItem('financeBudgets', JSON.stringify(updatedBudgets));
      
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
      const updatedBudgets = budgets.filter((b) => b.id !== id);
      
      setBudgets(updatedBudgets);
      localStorage.setItem('financeBudgets', JSON.stringify(updatedBudgets));
      
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
