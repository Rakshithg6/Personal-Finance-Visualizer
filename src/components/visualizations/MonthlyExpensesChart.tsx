import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MonthlyExpensesChart: React.FC = () => {
  const { transactions } = useFinance();
  const [timeRange, setTimeRange] = useState<number>(6); // Default to 6 months
  const [viewType, setViewType] = useState<string>("bar"); // Default to bar chart

  // Generate month range
  const monthRange = Array.from({ length: timeRange }).map((_, i) => {
    const month = subMonths(new Date(), i);
    return {
      date: month,
      monthKey: format(month, "yyyy-MM"),
      label: format(month, "MMM yy"),
    };
  }).reverse();

  // Calculate monthly data
  const monthlyData = monthRange.map((month) => {
    const start = startOfMonth(month.date);
    const end = endOfMonth(month.date);

    // Filter transactions for this month
    const monthTransactions = Array.isArray(transactions) ? transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    }) : [];

    // Calculate total income and expenses
    const income = monthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const savings = income - expenses;
    const savingsPercent = income > 0 ? Math.round((savings / income) * 100) : 0;

    return {
      name: month.label,
      income,
      expenses,
      savings,
      savingsPercent
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p
              key={entry.name}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          {payload[0]?.payload.savingsPercent !== undefined && (
            <p className="text-emerald-500 text-sm mt-2">
              Savings Rate: {payload[0].payload.savingsPercent}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-purple-100">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <div>
          <CardTitle className="text-lg font-bold text-purple-900">Monthly Financial Overview</CardTitle>
          <CardDescription>Income, Expenses, and Savings over time</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeRange.toString()}
            onValueChange={(value) => setTimeRange(parseInt(value))}
          >
            <SelectTrigger className="w-[100px] bg-white border-purple-200">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={viewType}
            onValueChange={setViewType}
          >
            <SelectTrigger className="w-[100px] bg-white border-purple-200">
              <SelectValue placeholder="Chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="composed">Combined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === "bar" ? (
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="savings"
                  name="Savings"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : viewType === "line" ? (
              <ComposedChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            ) : (
              <ComposedChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="savingsPercent"
                  name="Savings %"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  yAxisId={1}
                />
                <YAxis 
                  yAxisId={1}
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
