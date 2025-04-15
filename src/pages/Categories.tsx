
import React, { useState, useEffect } from "react";
import { CategoryList } from "@/components/categories/CategoryList";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Categories: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { transactions, categories } = useFinance();

  // Calculate spending summary
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];

  // Filter transactions for the selected month
  const monthTransactions = transactionsArray.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getFullYear() === date.getFullYear() &&
      t.amount < 0
    );
  });

  // Total spending
  const totalSpending = Math.abs(monthTransactions.reduce((sum, t) => sum + t.amount, 0));

  // Find top category
  const categorySpending = new Map();
  monthTransactions.forEach(t => {
    const amount = Math.abs(t.amount);
    const current = categorySpending.get(t.categoryId) || 0;
    categorySpending.set(t.categoryId, current + amount);
  });

  let topCategory = { id: "", name: "", amount: 0 };
  categorySpending.forEach((amount, categoryId) => {
    if (amount > topCategory.amount) {
      const category = categoriesArray.find(c => c.id === categoryId);
      if (category) {
        topCategory = { id: categoryId, name: category.name, amount };
      }
    }
  });

  // Count categories used
  const categoriesUsed = new Set(monthTransactions.map(t => t.categoryId)).size;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Default values for demo
  const demoTotalSpending = 34200;
  const demoTopCategory = { name: "Housing", amount: 18000 };
  const demoCategoriesUsed = 5;
  const demoTotalCategories = 10;

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 space-y-8 animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient">Categories</h1>
        
        <div className="mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Select month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="glass-card mb-8">
          <CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-t-lg">
            <CardTitle className="text-lg text-white">Spending Summary</CardTitle>
            <CardDescription className="text-gray-300">
              Overview for {format(date, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-800/50">
                <p className="text-sm text-gray-400">Total Spending</p>
                <p className="text-2xl font-bold text-white">
                  {totalSpending > 0 ? formatCurrency(totalSpending) : formatCurrency(demoTotalSpending)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50">
                <p className="text-sm text-gray-400">Top Category</p>
                <p className="text-2xl font-bold text-white">
                  {topCategory.name || demoTopCategory.name}
                </p>
                <p className="text-sm text-gray-400">
                  {topCategory.amount > 0 
                    ? formatCurrency(topCategory.amount) 
                    : formatCurrency(demoTopCategory.amount)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50">
                <p className="text-sm text-gray-400">Categories Used</p>
                <p className="text-2xl font-bold text-white">
                  {categoriesUsed > 0 ? `${categoriesUsed} / ${categoriesArray.length}` : `${demoCategoriesUsed} / ${demoTotalCategories}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CategoryList />
      </motion.div>
    </motion.div>
  );
};

export default Categories;
