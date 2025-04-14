
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/data";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SummaryCards: React.FC = () => {
  const { transactions } = useFinance();
  const currentMonth = new Date();
  const previousMonth = new Date(currentMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  // Filter transactions for current month
  const currentMonthStart = startOfMonth(currentMonth);
  const currentMonthEnd = endOfMonth(currentMonth);
  const currentMonthTransactions = transactions.filter(
    (t) => {
      const date = new Date(t.date);
      return date >= currentMonthStart && date <= currentMonthEnd;
    }
  );
  
  // Filter transactions for previous month
  const previousMonthStart = startOfMonth(previousMonth);
  const previousMonthEnd = endOfMonth(previousMonth);
  const previousMonthTransactions = transactions.filter(
    (t) => {
      const date = new Date(t.date);
      return date >= previousMonthStart && date <= previousMonthEnd;
    }
  );
  
  // Calculate current month metrics
  const currentIncome = currentMonthTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentExpenses = currentMonthTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const currentBalance = currentIncome - currentExpenses;
  
  // Calculate previous month metrics
  const previousIncome = previousMonthTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const previousExpenses = previousMonthTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Calculate percentage changes
  const incomeChange = previousIncome === 0 
    ? 100 
    : ((currentIncome - previousIncome) / previousIncome) * 100;
  
  const expensesChange = previousExpenses === 0 
    ? 0 
    : ((currentExpenses - previousExpenses) / previousExpenses) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Income</CardDescription>
          <CardTitle className="text-success flex items-center justify-between">
            {formatCurrency(currentIncome)}
            <TrendingUp className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm">
            {incomeChange >= 0 ? (
              <ArrowUp className="h-4 w-4 text-success mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-destructive mr-1" />
            )}
            <span className={incomeChange >= 0 ? "text-success" : "text-destructive"}>
              {Math.abs(incomeChange).toFixed(1)}%
            </span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Expenses</CardDescription>
          <CardTitle className="text-destructive flex items-center justify-between">
            {formatCurrency(currentExpenses)}
            <TrendingDown className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm">
            {expensesChange <= 0 ? (
              <ArrowDown className="h-4 w-4 text-success mr-1" />
            ) : (
              <ArrowUp className="h-4 w-4 text-destructive mr-1" />
            )}
            <span className={expensesChange <= 0 ? "text-success" : "text-destructive"}>
              {Math.abs(expensesChange).toFixed(1)}%
            </span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Current Balance</CardDescription>
          <CardTitle className={`flex items-center justify-between ${currentBalance >= 0 ? "text-success" : "text-destructive"}`}>
            {formatCurrency(currentBalance)}
            <Wallet className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            For {format(currentMonth, "MMMM yyyy")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
