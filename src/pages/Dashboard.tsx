
import React from "react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { MonthlyExpensesChart } from "@/components/visualizations/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/visualizations/CategoryPieChart";
import { SpendingInsights } from "@/components/dashboard/SpendingInsights";
import { BudgetComparisonChart } from "@/components/visualizations/BudgetComparisonChart";
import { useFinance } from "@/context/FinanceContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const { isLoading } = useFinance();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] rounded-lg" />
          <Skeleton className="h-[350px] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] rounded-lg" />
          <Skeleton className="h-[350px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Financial Dashboard</h1>
        <SummaryCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpensesChart />
        <CategoryPieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetComparisonChart />
        <SpendingInsights />
      </div>

      <div>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
