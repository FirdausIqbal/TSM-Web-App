"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, BarChart3, Users, Car, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/ui/Buttons";
// import { UserButton } from "./UserButton";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Revenue", icon: BarChart3, href: "/dashboard/revenue" },
  { label: "Customers", icon: Users, href: "/dashboard/customers" },
  { label: "Rentals", icon: Car, href: "/dashboard/rentals" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-40 lg:hidden bg-primary text-primary-foreground p-2 rounded-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">TripelDe</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="hidden sm:block lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-secondary/5 space-y-3">
          {/* <UserButton /> */}
          <SignOutButton />
          
          <p className="text-xs text-muted-foreground text-center">
            © 2024 TripelDe Mobilindo
          </p>
        </div>
      </aside>
    </>
  );
}
