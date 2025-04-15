
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
  const { categories, addTransaction, editTransaction, addCategory } = useFinance();

  // Use only 'id' for category keys, never '_id' or 'category_id'.
  // Default categories (always shown in dropdown)
  const defaultCategories = [
    { name: "Housing", color: "#ef4444", icon: "home", id: "1" },
    { name: "Food & Dining", color: "#60a5fa", icon: "utensils", id: "1" },
    { name: "Transportation", color: "#34d399", icon: "car", id: "2" },
    { name: "Entertainment", color: "#f87171", icon: "film", id: "4" },
    { name: "Shopping", color: "#fbbf24", icon: "shopping-bag", id: "5" },
    { name: "Healthcare", color: "#22d3ee", icon: "heart-pulse", id: "6" },
    { name: "Personal Care", color: "#f472b6", icon: "scissors", id: "7" },
    { name: "Education", color: "#6366f1", icon: "book", id: "8" },
    { name: "Investments", color: "#10b981", icon: "trending-up", id: "9" },
    { name: "Income", color: "#10b981", icon: "wallet", id: "10" },
    { name: "Other", color: "#9ca3af", icon: "more-horizontal", id: "11" },
  ];
  // Merge backend categories and defaults (no duplicates by id)
  const mergedCategories = [
    ...defaultCategories.filter(def => !categories.some(cat => cat.id === def.id)),
    ...categories,
  ];

  // State for Add Category dialog
  const [addCatOpen, setAddCatOpen] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatColor, setNewCatColor] = React.useState("#60a5fa"); // default color
  const [addingCat, setAddingCat] = React.useState(false);

  // Helper to handle Add Category selection
  // Helper to handle Add Category selection
  const handleCategoryChange = (val: string) => {
    if (val === "__add__") {
      setAddCatOpen(true);
    } else {
      form.setValue("categoryId", val);
    }
  }

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

  const handleSubmit = async (values: FormValues) => {
    const isExpense = values.categoryId !== "10"; // Assuming "10" is the Income category
    const numericAmount = Number(values.amount);
    const finalAmount = isExpense ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    if (transaction) {
      await editTransaction({
        id: transaction.id,
        amount: finalAmount,
        date: values.date.toISOString(),
        description: values.description,
        categoryId: values.categoryId,
      });
    } else {
      await addTransaction({
        amount: finalAmount,
        date: values.date.toISOString(),
        description: values.description,
        categoryId: values.categoryId,
      });
    }
    onSubmit();
  };

  return (
    <>
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
              <Select onValueChange={handleCategoryChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mergedCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: category.color,
                          marginRight: 8,
                          border: '1px solid #fff',
                        }} />
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                  <SelectItem value="__add__" className="text-primary font-semibold">
                    + Add Category
                  </SelectItem>
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
    {/* Add Category Dialog */}
    {addCatOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
          <h3 className="text-lg font-semibold mb-2">Add Category</h3>
          <input
            className="w-full border px-2 py-1 rounded mb-2"
            placeholder="Category name"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            disabled={addingCat}
          />
          <div className="mb-2">
            <label className="mr-2">Color:</label>
            <input
              type="color"
              value={newCatColor}
              onChange={e => setNewCatColor(e.target.value)}
              disabled={addingCat}
              style={{ width: 30, height: 30, verticalAlign: 'middle', border: 'none', background: 'none' }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setAddCatOpen(false)}
              disabled={addingCat}
            >Cancel</button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={async () => {
                if (!newCatName.trim()) return;
                setAddingCat(true);
                const result = await addCategory({ name: newCatName, color: newCatColor, icon: "tag" });
                setAddingCat(false);
                if (result && result.id) {
                  // Set the new category as selected (by id only)
                  form.setValue("categoryId", result.id);
                  setAddCatOpen(false);
                  setNewCatName("");
                  setNewCatColor("#60a5fa");
                }
              }}
              disabled={addingCat}
            >{addingCat ? "Adding..." : "Add"}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
