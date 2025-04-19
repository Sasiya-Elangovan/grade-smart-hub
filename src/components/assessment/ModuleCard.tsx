
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  icon,
  href,
  className,
}: ModuleCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="mb-2 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-2">
        <p>Create, submit, and evaluate using AI-powered tools.</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to={href}>Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
