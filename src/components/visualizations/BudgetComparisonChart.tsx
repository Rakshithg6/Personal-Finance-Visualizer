
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryTotal, formatCurrency, getCategoryById } from "@/lib/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const BudgetComparisonChart: React.FC = () => {
  const { transactions, budgets, categories } = useFinance();
  const currentMonth = format(new Date(), "yyyy-MM");
  
  // Filter transactions for current month
  const monthTransactions = Array.isArray(transactions) ? transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = format(transactionDate, "yyyy-MM");
    return transactionMonth === currentMonth;
  }) : [];

  // Get current month budgets
  const currentBudgets = Array.isArray(budgets) ? budgets.filter((budget) => budget.month === currentMonth) : [];

  if (currentBudgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual</CardTitle>
          <CardDescription>Current month comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-muted-foreground">No budget data available for the current month</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for chart
  const chartData = currentBudgets.map((budget) => {
    const category = getCategoryById(budget.categoryId, categories);
    const spent = getCategoryTotal(budget.categoryId, monthTransactions);
    const remaining = budget.amount - spent;
    
    return {
      name: category.name,
      budget: budget.amount,
      spent: spent,
      remaining: remaining > 0 ? remaining : 0,
      overBudget: remaining < 0 ? Math.abs(remaining) : 0,
      categoryColor: category.color,
    };
  }).sort((a, b) => (b.spent / b.budget) - (a.spent / a.budget));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
        <CardDescription>Current month comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spent" name="Spent" stackId="a" fill="#f87171" />
              <Bar dataKey="remaining" name="Remaining" stackId="a" fill="#4ade80" />
              <Bar dataKey="overBudget" name="Over Budget" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
