
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PieChart, DollarSign, BarChart, Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { label: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Transactions", path: "/transactions", icon: <DollarSign className="h-5 w-5" /> },
    { label: "Categories", path: "/categories", icon: <PieChart className="h-5 w-5" /> },
    { label: "Budgets", path: "/budgets", icon: <BarChart className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-30 transition-all duration-300 backdrop-blur-lg border-b border-white/10",
        scrolled 
          ? "bg-secondary/90 shadow-md" 
          : "bg-gradient-to-r from-[#1A1A1A] via-[#262626] to-[#1A1A1A]"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center">
            <Wallet className="h-8 w-8 mr-2 text-purple-500" />
            FinFlow
          </span>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center space-x-1 px-4 py-2 rounded-full transition-colors",
                isActive(link.path)
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary-foreground/10 hover:text-primary-foreground"
              )}
            >
              <span className={cn(
                "transition-transform",
                isActive(link.path) ? "scale-110" : ""
              )}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-secondary border-l border-white/10">
            <div className="flex justify-center my-8">
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center">
                <Wallet className="h-7 w-7 mr-2 text-purple-500" />
                FinFlow
              </span>
            </div>
            <nav className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-3 text-lg p-3 rounded-xl transition-all",
                    isActive(link.path)
                      ? "bg-primary/20 text-primary font-medium"
                      : "hover:bg-secondary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <span className={cn(
                    "transition-transform",
                    isActive(link.path) ? "scale-110" : ""
                  )}>
                    {link.icon}
                  </span>
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
