
import React from "react";
import { BudgetList } from "@/components/budgets/BudgetList";
import { BudgetComparisonChart } from "@/components/visualizations/BudgetComparisonChart";

const Budgets: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Budgets</h1>
      <BudgetComparisonChart />
      <BudgetList />
    </div>
  );
};

export default Budgets;
