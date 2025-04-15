
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";
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
  
  // Ensure categories and transactions are arrays
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  
  // Calculate totals for each category (only expenses)
  const categoryData = categoriesArray
    .filter(category => category.id !== "10") // Filter out income category
    .map((category) => {
      const amount = Math.abs(getCategoryTotal(category.id, transactionsArray));
      return {
        id: category.id,
        name: category.name,
        value: amount,
        color: category.color,
      };
    })
    .filter((item) => item.value > 0) // Only include categories with expenses
    .sort((a, b) => b.value - a.value); // Sort by highest amount

  // If no categories with expenses, provide dummy data
  const displayData = categoryData.length > 0 ? categoryData : [
    { id: "3", name: "Housing", value: 18000, color: "#FF6384" },
    { id: "1", name: "Food", value: 12000, color: "#36A2EB" },
    { id: "2", name: "Transportation", value: 8000, color: "#FFCE56" },
    { id: "4", name: "Entertainment", value: 5000, color: "#4BC0C0" },
    { id: "5", name: "Shopping", value: 6000, color: "#9966FF" },
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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={displayData[index].color} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-medium text-sm"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="shadow-lg border-purple-900/50">
      <CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold text-white">Spending by Category</CardTitle>
            <CardDescription className="text-gray-300">Top spending categories breakdown</CardDescription>
          </div>
          <Tabs value={viewType} onValueChange={setViewType} className="w-[280px]">
            <TabsList className="bg-gray-800 border border-gray-600">
              <TabsTrigger value="pie" className="data-[state=active]:bg-purple-900 text-white">Pie Chart</TabsTrigger>
              <TabsTrigger value="donut" className="data-[state=active]:bg-purple-900 text-white">Donut Chart</TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-purple-900 text-white">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="bg-gray-900 p-6">
        {displayData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No spending data available</p>
          </div>
        ) : (
          <Tabs value={viewType} onValueChange={setViewType}>
            <TabsContent value="pie" className="mt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={false}
                    >
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center" 
                      formatter={(value) => (
                        <span className="text-sm font-medium text-gray-300">{value}</span>
                      )}
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="donut" className="mt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label 
                        position="center" 
                        className="text-lg font-bold" 
                        fill="#fff"
                        value={`Total: ${formatCurrency(totalExpenses)}`} 
                      />
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
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="mt-4 space-y-3 max-h-[400px] overflow-auto pr-2">
                {displayData.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium text-white">{category.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-purple-300">{formatCurrency(category.value)}</span>
                      <span className="text-xs text-gray-400">
                        {Math.round((category.value / totalExpenses) * 100)}% of total
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
