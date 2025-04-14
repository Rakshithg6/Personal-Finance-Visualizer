
import React from "react";
import { Link } from "react-router-dom";
import { Home, PieChart, DollarSign, BarChart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const navLinks = [
    { label: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Transactions", path: "/transactions", icon: <DollarSign className="h-5 w-5" /> },
    { label: "Categories", path: "/categories", icon: <PieChart className="h-5 w-5" /> },
    { label: "Budgets", path: "/budgets", icon: <BarChart className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl md:text-2xl text-primary">FinFlow</span>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-3 text-lg"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
