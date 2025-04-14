import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryTotal, formatCurrency } from "@/lib/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CategoryPieChart: React.FC = () => {
  const { transactions, categories } = useFinance();
  const [viewType, setViewType] = useState<string>("pie");
  
  // Calculate totals for each category (only expenses)
  const categoryData = Array.isArray(categories) ? categories
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
    .sort((a, b) => b.value - a.value) : []; // Sort by highest amount

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-sm">
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

  const renderLabel = ({ name, percent }: any) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card className="shadow-lg border-purple-100">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold text-purple-900">Spending by Category</CardTitle>
            <CardDescription>Top spending categories breakdown</CardDescription>
          </div>
          <Tabs value={viewType} onValueChange={setViewType} className="w-[280px]">
            <TabsList className="bg-white border border-purple-100">
              <TabsTrigger value="pie" className="data-[state=active]:bg-purple-100">Pie Chart</TabsTrigger>
              <TabsTrigger value="donut" className="data-[state=active]:bg-purple-100">Donut Chart</TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-purple-100">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No spending data available</p>
          </div>
        ) : (
          <TabsContent value={viewType} forceMount className="mt-4">
            {viewType === "pie" && (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      dataKey="value"
                      labelLine={true}
                      label={renderLabel}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center" 
                      formatter={(value, entry, index) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {viewType === "donut" && (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right" 
                      formatter={(value, entry, index) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {viewType === "list" && (
              <div className="mt-4 space-y-3 max-h-[350px] overflow-auto pr-2">
                {categoryData.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex justify-between items-center p-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-purple-800">{formatCurrency(category.value)}</span>
                      <span className="text-xs text-gray-500">
                        {Math.round((category.value / totalExpenses) * 100)}% of total
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </CardContent>
    </Card>
  );
};
