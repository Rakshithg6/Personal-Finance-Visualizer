
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && val !== "", {
    message: "Amount must be a valid number",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters",
  }),
  categoryId: z.string({
    required_error: "Please select a category",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
}) => {
  const { categories, addTransaction, editTransaction } = useFinance();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: transaction
      ? {
          amount: String(Math.abs(transaction.amount)),
          date: new Date(transaction.date),
          description: transaction.description,
          categoryId: transaction.categoryId,
        }
      : {
          amount: "",
          date: new Date(),
          description: "",
          categoryId: "",
        },
  });

  const handleSubmit = (values: FormValues) => {
    const isExpense = values.categoryId !== "10"; // Assuming "10" is the Income category
    const numericAmount = Number(values.amount);
    const finalAmount = isExpense ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    if (transaction) {
      editTransaction({
        id: transaction.id,
        amount: finalAmount,
        date: values.date.toISOString(),
        description: values.description,
        categoryId: values.categoryId,
      });
    } else {
      addTransaction({
        amount: finalAmount,
        date: values.date.toISOString(),
        description: values.description,
        categoryId: values.categoryId,
      });
    }
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
                  {categories.map((category) => (
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description"
                  {...field}
                  className="resize-none"
                />
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
            {transaction ? "Update" : "Add"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
};
