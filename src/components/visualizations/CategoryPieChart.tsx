
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryTotal, formatCurrency } from "@/lib/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CategoryPieChart: React.FC = () => {
  const { transactions, categories } = useFinance();
  
  // Calculate totals for each category (only expenses)
  const categoryData = categories
    .filter(category => category.id !== "10") // Filter out income category
    .map((category) => {
      const amount = getCategoryTotal(category.id, transactions);
      return {
        id: category.id,
        name: category.name,
        value: amount,
        color: category.color,
      };
    })
    .filter((item) => item.value > 0) // Only include categories with expenses
    .sort((a, b) => b.value - a.value); // Sort by highest amount

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">
            {Math.round((data.value / totalExpenses) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Top spending categories</CardDescription>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No spending data available</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
