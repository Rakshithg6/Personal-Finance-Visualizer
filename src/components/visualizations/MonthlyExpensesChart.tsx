
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
  const { transactions, categories } = useFinance();
  const [timeRange, setTimeRange] = useState<number>(6); // Default to 6 months

  // Generate month range
  const monthRange = Array.from({ length: timeRange }).map((_, i) => {
    const month = subMonths(new Date(), i);
    return {
      date: month,
      monthKey: format(month, "yyyy-MM"),
      label: format(month, "MMM yy"),
    };
  }).reverse();

  // Calculate monthly expenses
  const monthlyData = monthRange.map((month) => {
    const start = startOfMonth(month.date);
    const end = endOfMonth(month.date);

    // Filter transactions for this month
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });

    // Calculate total income and expenses
    const income = monthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      name: month.label,
      income,
      expenses,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-sm">
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
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>Income vs. Expenses over time</CardDescription>
        </div>
        <Select
          value={timeRange.toString()}
          onValueChange={(value) => setTimeRange(parseInt(value))}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months</SelectItem>
            <SelectItem value="6">6 months</SelectItem>
            <SelectItem value="12">12 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
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
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
