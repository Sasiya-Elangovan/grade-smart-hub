
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Code, 
  FileText, 
  Calculator, 
  PenTool, 
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Text Evaluation",
      href: "/assessment/text",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Code Grading",
      href: "/assessment/code",
      icon: <Code className="h-5 w-5" />
    },
    {
      title: "Handwriting",
      href: "/assessment/handwriting",
      icon: <PenTool className="h-5 w-5" />
    },
    {
      title: "Math Problems",
      href: "/assessment/math",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      title: "All Assessments",
      href: "/assessments",
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-sidebar transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[280px]"
    )}>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "flex h-10 items-center justify-start gap-2 rounded-md px-3 py-2 text-base transition-colors",
                collapsed ? "justify-center" : "",
                location.pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Link to={item.href} className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-3">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-start",
              collapsed ? "justify-center" : ""
            )}
          >
            <span className={cn("mr-2", collapsed ? "mr-0" : "")}>🔧</span>
            {!collapsed && "Settings"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
