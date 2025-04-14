
import React from "react";
import { CategoryList } from "@/components/categories/CategoryList";

const Categories: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <CategoryList />
    </div>
  );
};

export default Categories;
