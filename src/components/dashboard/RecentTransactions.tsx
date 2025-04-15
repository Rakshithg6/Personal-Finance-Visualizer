
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

  // Always show the real recent transactions, even if less than 5
  const displayTransactions = recentTransactions;

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
