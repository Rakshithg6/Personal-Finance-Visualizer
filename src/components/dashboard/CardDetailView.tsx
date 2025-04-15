
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/data";
import { format, subMonths, parseISO } from "date-fns";
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  ArrowUp, 
  ArrowDown, 
  BarChart4, 
  Activity,
  Info,
  Calendar,
  DollarSign,
  PieChart as PieChartIcon
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type CardDetailProps = {
  open: boolean;
  onClose: () => void;
  type: "income" | "expenses" | "savings" | "balance";
  data: any;
};

export const CardDetailView: React.FC<CardDetailProps> = ({
  open,
  onClose,
  type,
  data
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Set chart data when component mounts or when selectedDate changes
    generateChartData(selectedDate);
  }, [selectedDate]);
  
  const generateChartData = (date: Date, months: number = 6) => {
    const result = [];
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(date, i);
      const monthName = format(monthDate, "MMM");
      let value;
      
      // Generate different values based on the month for more variance
      if (type === "balance") {
        const monthIndex = monthDate.getMonth();
        const baseValue = 10000 + (monthIndex * 1000); // Different base value for each month
        value = baseValue + Math.floor(Math.random() * 6000 - 1000);
      } else {
        value = Math.floor(15000 + Math.random() * 10000 - 5000); // Random value around 15000
      }
      
      result.push({
        month: monthName,
        value: value
      });
    }
    setChartData(result);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setTempSelectedDate(date);
    }
  };
  
  const handleApplyDate = () => {
    setSelectedDate(tempSelectedDate);
    // Close the calendar popover
    setCalendarOpen(false);
  };

  const [calendarOpen, setCalendarOpen] = useState(false);

  const renderTitle = () => {
    switch (type) {
      case "income":
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-green-900/30">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <span>Income Details</span>
            {/* Calendar Popover for Month Selection */}
            <div className="my-4">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMMM yyyy")}
                    <span className="ml-2">Change</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-3">
                    <CalendarComponent
                      mode="single"
                      selected={tempSelectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                    <Button
                      className="w-full mt-2"
                      onClick={handleApplyDate}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      case "expenses":
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-red-900/30">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <span>Expense Details</span>
          </div>
        );
      case "savings":
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-blue-900/30">
              <BarChart4 className="h-5 w-5 text-blue-500" />
            </div>
            <span>Savings Rate Details</span>
          </div>
        );
      case "balance":
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-indigo-900/30">
              <DollarSign className="h-5 w-5 text-indigo-500" />
            </div>
            <span>Balance Details</span>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (type) {
      case "income":
        return (
          <div className="space-y-6">
            <div className="text-3xl font-bold text-success">₹{(data.currentIncome || 50000).toLocaleString()}</div>
            
            {/* Monthly Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                Monthly Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Month</span>
                  <span className="font-medium">₹{(data.currentIncome || 50000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Previous Month</span>
                  <span className="font-medium">₹{(data.previousIncome || 48000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Change</span>
                  <span className={`font-medium flex items-center ${(data.incomeChange || 4.2) >= 0 ? "text-success" : "text-destructive"}`}>
                    {(data.incomeChange || 4.2) >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(data.incomeChange || 4.2).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Monthly Trend */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Trend</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Source Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                Income Sources
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Salary</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Investments</span>
                    <span>15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Other</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case "expenses":
        return (
          <div className="space-y-6">
            <div className="text-3xl font-bold text-destructive">₹{(data.currentExpenses || 34200).toLocaleString()}</div>
            
            {/* Monthly Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                Monthly Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Month</span>
                  <span className="font-medium">₹{(data.currentExpenses || 34200).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Previous Month</span>
                  <span className="font-medium">₹{(data.previousExpenses || 32500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Change</span>
                  <span className={`font-medium flex items-center ${(data.expensesChange || 5.2) <= 0 ? "text-success" : "text-destructive"}`}>
                    {(data.expensesChange || 5.2) <= 0 ? (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(data.expensesChange || 5.2).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Monthly Trend */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Trend</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.map(item => ({ ...item, value: item.value * 0.7 }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Top Expense Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                Top Expense Categories
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Housing</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Food</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Transportation</span>
                    <span>15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Other</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case "savings":
        return (
          <div className="space-y-6">
            <div className="text-3xl font-bold">
              <span className={`${(data.savingsRate || 31.6) >= 20 ? "text-success" : (data.savingsRate || 31.6) >= 0 ? "text-amber-500" : "text-destructive"}`}>
                {(data.savingsRate || 31.6)}%
              </span>
            </div>
            
            {/* Savings Progress */}
            <div className="space-y-3">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    (data.savingsRate || 31.6) >= 20 ? "bg-success" : 
                    (data.savingsRate || 31.6) >= 10 ? "bg-amber-500" : 
                    (data.savingsRate || 31.6) >= 0 ? "bg-orange-500" : "bg-destructive"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, (data.savingsRate || 31.6)))}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground">
                {(data.savingsRate || 31.6) >= 20 ? "Excellent savings rate! You're on track for your financial goals." : 
                 (data.savingsRate || 31.6) >= 10 ? "Good savings rate. Keep it up to reach your financial goals faster." : 
                 (data.savingsRate || 31.6) >= 0 ? "Fair savings rate. Consider reducing expenses to save more." : 
                 "Negative savings rate. Your expenses exceed your income."}
              </div>
            </div>
            
            {/* Monthly Trend */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Trend</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.map(item => ({ 
                      ...item, 
                      savingsRate: 20 + Math.floor(Math.random() * 20) 
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="savingsRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Savings Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                Savings Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Total Income</div>
                  <div className="text-lg font-medium">₹{(data.currentIncome || 50000).toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Total Expenses</div>
                  <div className="text-lg font-medium">₹{(data.currentExpenses || 34200).toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Amount Saved</div>
                  <div className="text-lg font-medium">₹{((data.currentIncome || 50000) - (data.currentExpenses || 34200)).toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Recommended</div>
                  <div className="text-lg font-medium">20%+</div>
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div className="rounded-lg bg-blue-950/30 border border-blue-900/40 p-4">
              <h4 className="font-medium text-blue-400 mb-2">Savings Tips</h4>
              <ul className="text-sm space-y-1 list-disc pl-5 text-blue-200/80">
                <li>Aim to save at least 20% of your income</li>
                <li>Consider automating your savings</li>
                <li>Build an emergency fund of 3-6 months of expenses</li>
                <li>Review your budget regularly to find savings opportunities</li>
              </ul>
            </div>
          </div>
        );
      
      case "balance":
        return (
          <div className="space-y-6">
            <div className="text-3xl font-bold">
              <span className={`${(data.currentBalance || 15800) >= 0 ? "text-success" : "text-destructive"}`}>
                ₹{(data.currentBalance || 15800).toLocaleString()}
              </span>
            </div>
            
            {/* Month Information */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>For {format(selectedDate, "MMMM yyyy")}</span>
              </div>
              
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={tempSelectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                    <div className="p-3 border-t border-gray-700 flex justify-end">
                      <Button size="sm" onClick={handleApplyDate}>Apply</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Balance Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                Balance Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Total Income</div>
                  <div className="text-lg font-bold text-success">₹{(data.currentIncome || 50000).toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Total Expenses</div>
                  <div className="text-lg font-bold text-destructive">₹{(data.currentExpenses || 34200).toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            {/* Monthly Trend */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Monthly Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fill: '#aaa' }} />
                    <YAxis tick={{ fill: '#aaa' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e1e2f', 
                        borderColor: '#333', 
                        borderRadius: '8px' 
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Balance']}
                      labelFormatter={(label) => `${label} ${format(selectedDate, "yyyy")}`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Status */}
            <div className={`rounded-lg p-4 ${(data.currentBalance || 15800) >= 0 ? "bg-green-950/30 border border-green-900/40" : "bg-red-950/30 border border-red-900/40"}`}>
              <h4 className={`font-medium mb-2 ${(data.currentBalance || 15800) >= 0 ? "text-green-400" : "text-red-400"}`}>
                Financial Status
              </h4>
              <p className="text-sm">
                {(data.currentBalance || 15800) >= 0 
                  ? "You're doing well! Your income exceeds your expenses, which means you're saving money and building wealth." 
                  : "Your expenses exceed your income. Consider reviewing your budget to find areas where you can reduce spending."}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] panel-gradient border-white/10 enhanced-shadow max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{renderTitle()}</DialogTitle>
          <DialogDescription>
            Detailed analysis and breakdown for {format(selectedDate, "MMMM yyyy")}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
