
import React from "react";
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
import { format } from "date-fns";
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
  DollarSign
} from "lucide-react";

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
  const renderTitle = () => {
    switch (type) {
      case "income":
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-green-900/30">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <span>Income Details</span>
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
            <div className="text-3xl font-bold text-success">{formatCurrency(data.currentIncome)}</div>
            
            {/* Monthly Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                Monthly Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Month</span>
                  <span className="font-medium">{formatCurrency(data.currentIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Previous Month</span>
                  <span className="font-medium">{formatCurrency(data.previousIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Change</span>
                  <span className={`font-medium flex items-center ${data.incomeChange >= 0 ? "text-success" : "text-destructive"}`}>
                    {data.incomeChange >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(data.incomeChange).toFixed(1)}%
                  </span>
                </div>
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
            <div className="text-3xl font-bold text-destructive">{formatCurrency(data.currentExpenses)}</div>
            
            {/* Monthly Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                Monthly Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Month</span>
                  <span className="font-medium">{formatCurrency(data.currentExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Previous Month</span>
                  <span className="font-medium">{formatCurrency(data.previousExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Change</span>
                  <span className={`font-medium flex items-center ${data.expensesChange <= 0 ? "text-success" : "text-destructive"}`}>
                    {data.expensesChange <= 0 ? (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(data.expensesChange).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top Expense Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-muted-foreground" />
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
              <span className={`${data.savingsRate >= 20 ? "text-success" : data.savingsRate >= 0 ? "text-amber-500" : "text-destructive"}`}>
                {data.savingsRate}%
              </span>
            </div>
            
            {/* Savings Progress */}
            <div className="space-y-3">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    data.savingsRate >= 20 ? "bg-success" : 
                    data.savingsRate >= 10 ? "bg-amber-500" : 
                    data.savingsRate >= 0 ? "bg-orange-500" : "bg-destructive"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, data.savingsRate))}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground">
                {data.savingsRate >= 20 ? "Excellent savings rate! You're on track for your financial goals." : 
                 data.savingsRate >= 10 ? "Good savings rate. Keep it up to reach your financial goals faster." : 
                 data.savingsRate >= 0 ? "Fair savings rate. Consider reducing expenses to save more." : 
                 "Negative savings rate. Your expenses exceed your income."}
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
                  <div className="text-lg font-medium">{formatCurrency(data.currentIncome)}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Total Expenses</div>
                  <div className="text-lg font-medium">{formatCurrency(data.currentExpenses)}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Amount Saved</div>
                  <div className="text-lg font-medium">{formatCurrency(data.currentIncome - data.currentExpenses)}</div>
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
              <span className={`${data.currentBalance >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(data.currentBalance)}
              </span>
            </div>
            
            {/* Month Information */}
            <div className="flex items-center justify-center p-4 rounded-lg bg-secondary">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>For {format(new Date(), "MMMM yyyy")}</span>
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
                  <div className="text-lg font-medium text-success">{formatCurrency(data.currentIncome)}</div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="text-muted-foreground mb-1">Total Expenses</div>
                  <div className="text-lg font-medium text-destructive">{formatCurrency(data.currentExpenses)}</div>
                </div>
              </div>
            </div>
            
            {/* Trend */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Trend</h3>
              <div className="h-32 flex items-end space-x-2">
                {[0.6, 0.8, 0.4, 0.7, 0.3, 0.9].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t-sm ${data.currentBalance >= 0 ? "bg-success/60" : "bg-destructive/60"}`} 
                      style={{ height: `${height * 100}%` }}
                    ></div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(new Date().setMonth(new Date().getMonth() - 5 + i)), "MMM")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Status */}
            <div className={`rounded-lg p-4 ${data.currentBalance >= 0 ? "bg-green-950/30 border border-green-900/40" : "bg-red-950/30 border border-red-900/40"}`}>
              <h4 className={`font-medium mb-2 ${data.currentBalance >= 0 ? "text-green-400" : "text-red-400"}`}>
                Financial Status
              </h4>
              <p className="text-sm">
                {data.currentBalance >= 0 
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
            Detailed analysis and breakdown for {format(new Date(), "MMMM yyyy")}
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
