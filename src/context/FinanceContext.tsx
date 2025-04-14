
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, Category, Budget } from "@/types";
import { 
  sampleTransactions,
  categories as initialCategories,
  sampleBudgets,
  generateId
} from "@/lib/data";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id">) => void;
  editBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
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
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [categories] = useState<Category[]>(initialCategories);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions((prev) => [newTransaction, ...prev]);
    toast({
      title: "Transaction Added",
      description: "Your transaction has been successfully added.",
    });
  };

  const editTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transaction.id ? transaction : t))
    );
    toast({
      title: "Transaction Updated",
      description: "Your transaction has been successfully updated.",
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Your transaction has been successfully deleted.",
    });
  };

  const addBudget = (budget: Omit<Budget, "id">) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets((prev) => {
      // Remove any existing budget for this category and month
      const filtered = prev.filter(
        (b) => !(b.categoryId === budget.categoryId && b.month === budget.month)
      );
      return [...filtered, newBudget];
    });
    toast({
      title: "Budget Added",
      description: "Your budget has been successfully set.",
    });
  };

  const editBudget = (budget: Budget) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === budget.id ? budget : b))
    );
    toast({
      title: "Budget Updated",
      description: "Your budget has been successfully updated.",
    });
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast({
      title: "Budget Deleted",
      description: "Your budget has been successfully deleted.",
    });
  };

  const value = {
    transactions,
    categories,
    budgets,
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
