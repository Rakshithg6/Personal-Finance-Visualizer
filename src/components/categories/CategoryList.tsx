
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryTotal } from "@/lib/data";
import { formatCurrency } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CategoryList: React.FC = () => {
  const { categories, transactions } = useFinance();
  const [viewType, setViewType] = useState<string>("pie");
  
  // Ensure categories and transactions are arrays
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const transactionsArray = Array.isArray(transactions) ? transactions : [];

  // Calculate totals for each category
  const categoryData = categoriesArray
    .filter(category => category.id !== "10") // Filter out income category
    .map((category) => {
      const amount = Math.abs(getCategoryTotal(category.id, transactionsArray));
      return {
        id: category.id,
        name: category.name,
        value: Math.max(amount, 0), // Ensure we don't have negative values
        color: category.color,
      };
    })
    .filter((item) => item.value > 0) // Only include categories with expenses
    .sort((a, b) => b.value - a.value); // Sort by highest amount

  // If no categories with expenses, provide dummy data
  const displayData = categoryData.length > 0 ? categoryData : [
    { id: "1", name: "Housing", value: 2000, color: "#FF6384" },
    { id: "2", name: "Food", value: 1200, color: "#36A2EB" },
    { id: "3", name: "Transportation", value: 800, color: "#FFCE56" },
    { id: "4", name: "Entertainment", value: 500, color: "#4BC0C0" },
    { id: "5", name: "Shopping", value: 700, color: "#9966FF" },
  ];

  const totalExpenses = displayData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 border rounded-lg shadow-sm border-gray-700">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">{formatCurrency(data.value)}</p>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gradient">Spending Categories</h2>
        <Tabs value={viewType} onValueChange={setViewType} className="w-[280px]">
          <TabsList className="bg-gray-800 border border-gray-600">
            <TabsTrigger value="pie" className="data-[state=active]:bg-purple-900 text-white">Pie Chart</TabsTrigger>
            <TabsTrigger value="donut" className="data-[state=active]:bg-purple-900 text-white">Donut Chart</TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-purple-900 text-white">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6">
          <TabsContent value={viewType} forceMount className="mt-0">
            {viewType === "pie" && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={true}
                        >
                          {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical"
                          verticalAlign="middle"
                          align="right" 
                          formatter={(value) => (
                            <span className="text-sm font-medium text-gray-300">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    {displayData.map((category) => (
                      <div
                        key={category.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-white">
                            {formatCurrency(category.value)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((category.value / totalExpenses) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {viewType === "donut" && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical"
                          verticalAlign="middle"
                          align="right" 
                          formatter={(value) => (
                            <span className="text-sm font-medium text-gray-300">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    {displayData.map((category) => (
                      <div
                        key={category.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-white">
                            {formatCurrency(category.value)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((category.value / totalExpenses) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {viewType === "list" && (
              <div className="space-y-4">
                {displayData.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-white">
                        {formatCurrency(category.value)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((category.value / totalExpenses) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};
