
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { useFinance } from "@/context/FinanceContext";
import { Budget } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  categoryId: z.string({
    required_error: "Please select a category",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && val !== "" && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  month: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  onSubmit,
}) => {
  const { categories, addBudget, editBudget } = useFinance();
  const currentMonth = format(new Date(), "yyyy-MM");

  // Filter out the Income category (assuming it has id "10")
  const filteredCategories = categories.filter(cat => cat.id !== "10");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: budget
      ? {
          categoryId: budget.categoryId,
          amount: String(budget.amount),
          month: budget.month,
        }
      : {
          categoryId: "",
          amount: "",
          month: currentMonth,
        },
  });

  const handleSubmit = (values: FormValues) => {
    const budgetData = {
      categoryId: values.categoryId,
      amount: Number(values.amount),
      month: values.month,
    };

    if (budget) {
      editBudget({ ...budgetData, id: budget.id });
    } else {
      addBudget(budgetData);
    }
    onSubmit();
  };

  // Generate month options (current month and next 6 months)
  const monthOptions = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = format(month, "yyyy-MM");
    const label = format(month, "MMMM yyyy");
    monthOptions.push({ value, label });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    {...field}
                    placeholder="0.00"
                    className="pl-8"
                    type="number"
                    step="0.01"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSubmit}>
            Cancel
          </Button>
          <Button type="submit">
            {budget ? "Update" : "Set"} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
};
