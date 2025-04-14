
import React from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
