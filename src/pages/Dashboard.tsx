
import React from "react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { MonthlyExpensesChart } from "@/components/visualizations/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/visualizations/CategoryPieChart";
import { SpendingInsights } from "@/components/dashboard/SpendingInsights";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <SummaryCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpensesChart />
        <CategoryPieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingInsights />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
