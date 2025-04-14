
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryById, formatCurrency } from "@/lib/data";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ArrowUpRight, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SpendingInsights: React.FC = () => {
  const { transactions, budgets, categories } = useFinance();
  const currentMonth = format(new Date(), "yyyy-MM");
  
  // Ensure transactions is an array
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const budgetsArray = Array.isArray(budgets) ? budgets : [];
  
  // Filter transactions for current month
  const currentMonthTransactions = transactionsArray.filter((t) => {
    const date = new Date(t.date);
    return format(date, "yyyy-MM") === currentMonth;
  });
  
  // Get current month's expenses only
  const expenses = currentMonthTransactions.filter((t) => t.amount < 0);
  
  // Get current month budgets
  const currentBudgets = budgetsArray.filter((b) => b.month === currentMonth);
  
  // Find largest expense
  const largestExpense = expenses.length > 0 
    ? [...expenses].sort((a, b) => a.amount - b.amount)[0]
    : null;
  
  // Find highest spending category
  const categoryExpenses = new Map();
  expenses.forEach((t) => {
    const current = categoryExpenses.get(t.categoryId) || 0;
    categoryExpenses.set(t.categoryId, current + Math.abs(t.amount));
  });
  
  let highestCategory = { id: "", amount: 0 };
  categoryExpenses.forEach((amount, categoryId) => {
    if (amount > highestCategory.amount) {
      highestCategory = { id: categoryId, amount };
    }
  });
  
  // Find categories over budget
  const categoriesOverBudget = currentBudgets.filter((budget) => {
    const spent = categoryExpenses.get(budget.categoryId) || 0;
    return spent > budget.amount;
  });
  
  // Check for unusual spending
  const lastWeekStart = subDays(new Date(), 7);
  const lastWeekTransactions = expenses.filter(
    (t) => new Date(t.date) >= lastWeekStart
  );
  
  const averageDailySpending = lastWeekTransactions.length > 0
    ? lastWeekTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / 7
    : 0;
  
  // Check if any daily spending was 2x the average
  const hasUnusualSpending = lastWeekTransactions.some((t) => {
    const amount = Math.abs(t.amount);
    return amount > averageDailySpending * 2 && amount > 50; // Minimum threshold
  });
  
  return (
    <Card className="shadow-lg border-purple-900/50">
      <CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-t-lg">
        <CardTitle className="text-white">Spending Insights</CardTitle>
        <CardDescription className="text-gray-300">Personalized financial observations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-gray-900">
        {expenses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No expenses recorded this month. Adding sample data for demonstration.
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-900/30 p-2 rounded-full text-amber-500">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Largest expense</h3>
                  <p className="text-sm text-gray-400">
                    Monthly Rent - {formatCurrency(18000)} on {format(new Date(), "MMM dd")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 p-2 rounded-full text-blue-500">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Highest spending category</h3>
                  <p className="text-sm text-gray-400">
                    Housing - {formatCurrency(18000)} this month
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-900/30 p-2 rounded-full text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Budget alerts</h3>
                  <p className="text-sm text-gray-400">
                    2 categories over budget: Food & Dining, Entertainment
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-900/30 p-2 rounded-full text-purple-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Unusual spending detected</h3>
                  <p className="text-sm text-gray-400">
                    You have larger than usual expenses in the past week
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {largestExpense && (
              <div className="flex items-start space-x-3">
                <div className="bg-amber-900/30 p-2 rounded-full text-amber-500">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Largest expense</h3>
                  <p className="text-sm text-gray-400">
                    {largestExpense.description} - {formatCurrency(Math.abs(largestExpense.amount))} on {format(new Date(largestExpense.date), "MMM dd")}
                  </p>
                </div>
              </div>
            )}
            
            {highestCategory.id && (
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 p-2 rounded-full text-blue-500">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Highest spending category</h3>
                  <p className="text-sm text-gray-400">
                    {getCategoryById(highestCategory.id, categories).name} - {formatCurrency(highestCategory.amount)} this month
                  </p>
                </div>
              </div>
            )}
            
            {categoriesOverBudget.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="bg-red-900/30 p-2 rounded-full text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Budget alerts</h3>
                  <p className="text-sm text-gray-400">
                    {categoriesOverBudget.length} {categoriesOverBudget.length === 1 ? 'category' : 'categories'} over budget: {categoriesOverBudget.map(b => getCategoryById(b.categoryId, categories).name).join(', ')}
                  </p>
                </div>
              </div>
            )}
            
            {hasUnusualSpending && (
              <div className="flex items-start space-x-3">
                <div className="bg-purple-900/30 p-2 rounded-full text-purple-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Unusual spending detected</h3>
                  <p className="text-sm text-gray-400">
                    You have larger than usual expenses in the past week
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
