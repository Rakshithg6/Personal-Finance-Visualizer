
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryTotal } from "@/lib/data";
import { formatCurrency } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CategoryList: React.FC = () => {
  const { categories, transactions } = useFinance();
  
  // Ensure categories and transactions are arrays
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const transactionsArray = Array.isArray(transactions) ? transactions : [];

  // Calculate totals for each category
  const categoryData = categoriesArray
    .map((category) => {
      const amount = getCategoryTotal(category.id, transactionsArray);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Categories</h2>

      {categoryData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No spending data available. Add transactions to see category
                breakdown.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
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
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div
                      key={category.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">
                          {formatCurrency(category.value)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((category.value / totalExpenses) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
