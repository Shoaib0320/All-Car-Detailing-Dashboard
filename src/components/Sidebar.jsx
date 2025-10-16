"use client";

import {
  Home,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Menu,
  Phone,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Contacts", href: "/dashboard/contacts", icon: Phone },
    { label: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <TooltipProvider>
      {/* Mobile Overlay */}
      {openMobile && (
        <div
          onClick={() => setOpenMobile(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        ></div>
      )}

      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: collapsed ? 80 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed lg:static z-40 flex flex-col h-screen bg-white border-r shadow-sm",
          openMobile ? "left-0" : "-left-80",
          "lg:left-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <span className="text-xl font-semibold tracking-tight whitespace-nowrap">
              My<span className="text-blue-600">Dashboard</span>
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-100"
          >
            <Menu size={20} />
          </Button>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center" : "justify-start",
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    <item.icon
                      size={20}
                      className={cn("shrink-0", collapsed ? "mr-0" : "mr-2")}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="p-3">
          <button className="flex items-center w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 transition">
            <LogOut size={18} className="mr-2" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <Menu />
      </Button>
    </TooltipProvider>
  );
}
