
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/data";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Wallet, IndianRupee, BarChart4, Activity } from "lucide-react";
import { CardDetailView } from "./CardDetailView";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SummaryCards: React.FC = () => {
  const { transactions } = useFinance();
  const [selectedCard, setSelectedCard] = useState<"income" | "expenses" | "savings" | "balance" | null>(null);
  
  const currentMonth = new Date();
  const previousMonth = new Date(currentMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  // Filter transactions for current month
  const currentMonthStart = startOfMonth(currentMonth);
  const currentMonthEnd = endOfMonth(currentMonth);
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  
  const currentMonthTransactions = transactionsArray.filter(
    (t) => {
      const date = new Date(t.date);
      return date >= currentMonthStart && date <= currentMonthEnd;
    }
  );
  
  // Filter transactions for previous month
  const previousMonthStart = startOfMonth(previousMonth);
  const previousMonthEnd = endOfMonth(previousMonth);
  const previousMonthTransactions = transactionsArray.filter(
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
  
  // Calculate savings rate
  const savingsRate = currentIncome > 0 
    ? Math.round((currentBalance / currentIncome) * 100) 
    : 0;
  
  // Data for detail view
  const detailData = {
    currentIncome,
    previousIncome,
    incomeChange,
    currentExpenses,
    previousExpenses,
    expensesChange,
    savingsRate,
    currentBalance
  };

  const handleCardClick = (cardType: "income" | "expenses" | "savings" | "balance") => {
    setSelectedCard(cardType);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="glass-card card-hover card-glow enhanced-shadow"
          onClick={() => handleCardClick("income")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-blue-400">
              <IndianRupee className="h-4 w-4 mr-1" />
              Income
            </CardDescription>
            <CardTitle className="text-success flex items-center justify-between">
              {formatCurrency(currentIncome)}
              <div className="p-2 rounded-full bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
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
        
        <Card 
          className="glass-card card-hover card-glow enhanced-shadow"
          onClick={() => handleCardClick("expenses")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-red-400">
              <IndianRupee className="h-4 w-4 mr-1" />
              Expenses
            </CardDescription>
            <CardTitle className="text-destructive flex items-center justify-between">
              {formatCurrency(currentExpenses)}
              <div className="p-2 rounded-full bg-red-900/30">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
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
        
        <Card 
          className="glass-card card-hover card-glow enhanced-shadow"
          onClick={() => handleCardClick("savings")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-blue-400">
              <BarChart4 className="h-4 w-4 mr-1" />
              Savings Rate
            </CardDescription>
            <CardTitle className={`flex items-center justify-between ${savingsRate >= 20 ? "text-success" : savingsRate >= 0 ? "text-amber-500" : "text-destructive"}`}>
              {savingsRate}%
              <div className="p-2 rounded-full bg-blue-900/30">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    savingsRate >= 20 ? "bg-success" : 
                    savingsRate >= 10 ? "bg-amber-500" : 
                    savingsRate >= 0 ? "bg-orange-500" : "bg-destructive"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {savingsRate >= 20 ? "Excellent" : 
                 savingsRate >= 10 ? "Good" : 
                 savingsRate >= 0 ? "Fair" : "Needs improvement"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="glass-card card-hover card-glow enhanced-shadow"
          onClick={() => handleCardClick("balance")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-indigo-400">
              <Wallet className="h-4 w-4 mr-1" />
              Current Balance
            </CardDescription>
            <CardTitle className={`flex items-center justify-between ${currentBalance >= 0 ? "text-success" : "text-destructive"}`}>
              {formatCurrency(currentBalance)}
              <div className="p-2 rounded-full bg-indigo-900/30">
                <Wallet className="h-5 w-5 text-indigo-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground">
                For {format(currentMonth, "MMMM yyyy")}
              </div>
              <div className="text-xs mt-1">
                {currentBalance >= 0 
                  ? "You're doing well! Keep it up." 
                  : "You're spending more than you earn."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedCard && (
        <CardDetailView 
          open={!!selectedCard} 
          onClose={() => setSelectedCard(null)} 
          type={selectedCard} 
          data={detailData}
        />
      )}
    </>
  );
};
