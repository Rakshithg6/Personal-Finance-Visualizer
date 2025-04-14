
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
  const { transactions, budgets } = useFinance();
  const currentMonth = format(new Date(), "yyyy-MM");
  
  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return format(date, "yyyy-MM") === currentMonth;
  });
  
  // Get current month's expenses only
  const expenses = currentMonthTransactions.filter((t) => t.amount < 0);
  
  // Get current month budgets
  const currentBudgets = budgets.filter((b) => b.month === currentMonth);
  
  // Find largest expense
  const largestExpense = [...expenses].sort((a, b) => a.amount - b.amount)[0];
  
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
  
  const averageDailySpending = lastWeekTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount), 0
  ) / 7;
  
  // Check if any daily spending was 2x the average
  const hasUnusualSpending = lastWeekTransactions.some((t) => {
    const amount = Math.abs(t.amount);
    return amount > averageDailySpending * 2 && amount > 50; // Minimum threshold
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Personalized financial observations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No expenses recorded this month</p>
          </div>
        ) : (
          <>
            {largestExpense && (
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Largest expense</h3>
                  <p className="text-sm text-muted-foreground">
                    {largestExpense.description} - {formatCurrency(Math.abs(largestExpense.amount))} on {format(new Date(largestExpense.date), "MMM dd")}
                  </p>
                </div>
              </div>
            )}
            
            {highestCategory.id && (
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Highest spending category</h3>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryById(highestCategory.id).name} - {formatCurrency(highestCategory.amount)} this month
                  </p>
                </div>
              </div>
            )}
            
            {categoriesOverBudget.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Budget alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoriesOverBudget.length} {categoriesOverBudget.length === 1 ? 'category' : 'categories'} over budget: {categoriesOverBudget.map(b => getCategoryById(b.categoryId).name).join(', ')}
                  </p>
                </div>
              </div>
            )}
            
            {hasUnusualSpending && (
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Unusual spending detected</h3>
                  <p className="text-sm text-muted-foreground">
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
