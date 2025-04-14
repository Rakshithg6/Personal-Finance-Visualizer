
import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, getCategoryById, getCategoryTotal } from "@/lib/data";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BudgetForm } from "./BudgetForm";
import { Budget } from "@/types";

export const BudgetList: React.FC = () => {
  const { budgets, transactions, categories, deleteBudget } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>(
    undefined
  );
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  // Ensure transactions is an array
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const budgetsArray = Array.isArray(budgets) ? budgets : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];

  // Filter transactions for the selected month
  const monthTransactions = transactionsArray.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = format(transactionDate, "yyyy-MM");
    return transactionMonth === selectedMonth;
  });

  // Generate month options (3 months back and 3 months forward)
  const monthOptions = [];
  const now = new Date();
  for (let i = -3; i < 4; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = format(month, "yyyy-MM");
    const label = format(month, "MMMM yyyy");
    monthOptions.push({ value, label });
  }

  // Get the current month budgets
  const currentBudgets = budgetsArray.filter(
    (budget) => budget.month === selectedMonth
  );

  // Calculation for the budget comparison chart
  const budgetData = categoriesArray
    .filter((category) => category.id !== "10") // Exclude the Income category
    .map((category) => {
      const budget = currentBudgets.find(
        (budget) => budget.categoryId === category.id
      );
      const spent = getCategoryTotal(category.id, monthTransactions);
      const budgetAmount = budget ? budget.amount : 0;
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

      return {
        id: category.id,
        categoryName: category.name,
        color: category.color,
        budgetId: budget?.id,
        budgetAmount,
        spent,
        remaining: budgetAmount - spent,
        percentage: Math.min(percentage, 100), // Cap at 100% for the visual
        overBudget: spent > budgetAmount && budgetAmount > 0,
      };
    })
    .filter((item) => item.budgetAmount > 0 || item.spent > 0)
    .sort((a, b) => b.percentage - a.percentage);

  const handleAddClick = () => {
    setSelectedBudget(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedBudgetId(id);
    setAlertDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBudgetId) {
      deleteBudget(selectedBudgetId);
      setSelectedBudgetId(null);
    }
    setAlertDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" /> Set Budget
          </Button>
        </div>
      </div>

      {budgetData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No budgets found for this month
              </p>
              <Button onClick={handleAddClick} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Set Your First Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetData.map((item) => (
            <Card key={item.id} className={item.overBudget ? "border-destructive" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.categoryName}
                    </CardTitle>
                    <CardDescription>
                      {item.budgetAmount > 0 
                        ? `${Math.round(item.percentage)}% of budget used` 
                        : "No budget set"}
                    </CardDescription>
                  </div>
                  {item.budgetId && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleEditClick({
                            id: item.budgetId!,
                            categoryId: item.id,
                            amount: item.budgetAmount,
                            month: selectedMonth,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(item.budgetId!)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress 
                    value={item.percentage} 
                    className={item.overBudget ? "bg-destructive/20" : ""}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="font-medium">
                        {formatCurrency(item.spent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">
                        {formatCurrency(item.budgetAmount)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p
                        className={`font-medium ${
                          item.remaining < 0 ? "text-destructive" : "text-success"
                        }`}
                      >
                        {formatCurrency(item.remaining)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBudget ? "Edit Budget" : "Set Budget"}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={selectedBudget}
            onSubmit={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the budget for this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
