
import React from "react";
import { TransactionList } from "@/components/transactions/TransactionList";

const Transactions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <TransactionList />
    </div>
  );
};

export default Transactions;
