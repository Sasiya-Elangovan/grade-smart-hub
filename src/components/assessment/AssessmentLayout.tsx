
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AssessmentLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function AssessmentLayout({
  title,
  description,
  icon,
  children
}: AssessmentLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <Tabs defaultValue="create">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="create">Create Assessment</TabsTrigger>
          <TabsTrigger value="evaluate">Evaluate Submission</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Create New Assessment</h3>
            {children}
          </Card>
        </TabsContent>
        <TabsContent value="evaluate">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Evaluate Student Submission</h3>
            {children}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
