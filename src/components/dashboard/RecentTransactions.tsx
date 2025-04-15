
import React from "react";
import { format } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, getCategoryById } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const RecentTransactions: React.FC = () => {
  const { transactions, categories } = useFinance();

  // Sort transactions by date (newest first) and take the most recent 5
  const recentTransactions = Array.isArray(transactions) 
    ? [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  // If no transactions, create dummy data
  const displayTransactions = recentTransactions.length > 0 ? recentTransactions : [
    { id: "1", description: "Monthly Rent", amount: -18000, date: "2025-04-01", categoryId: "1" },
    { id: "2", description: "Salary", amount: 50000, date: "2025-04-05", categoryId: "10" },
    { id: "3", description: "Grocery Shopping", amount: -4500, date: "2025-04-08", categoryId: "2" },
    { id: "4", description: "Electricity Bill", amount: -2300, date: "2025-04-10", categoryId: "5" },
    { id: "5", description: "Movie Night", amount: -1500, date: "2025-04-12", categoryId: "4" },
  ];

  return (
    <Card className="glass-card enhanced-shadow">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransactions.map((transaction) => {
            const category = getCategoryById(transaction.categoryId, categories);
            return (
              <div key={transaction.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-start space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white mt-1 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-xs font-bold">{category.name.substring(0, 2)}</span>
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-primary transition-colors">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
                <div className={`text-right font-extrabold text-lg ${transaction.amount < 0 ? "text-destructive" : "text-success"}`}>
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full hover:bg-primary/20 transition-colors" asChild>
          <Link to="/transactions" className="flex items-center justify-center">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
