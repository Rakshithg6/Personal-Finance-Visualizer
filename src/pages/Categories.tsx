
import React from "react";
import { CategoryList } from "@/components/categories/CategoryList";
import { motion } from "framer-motion";

const Categories: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 space-y-8 animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-6 text-gradient">Categories</h1>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CategoryList />
      </motion.div>
    </motion.div>
  );
};

export default Categories;
