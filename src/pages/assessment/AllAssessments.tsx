
import React from "react";
import { 
  BookOpen, 
  FileText, 
  Code, 
  PenTool, 
  Calculator, 
  Search, 
  Plus 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AllAssessments = () => {
  const assessments = [
    {
      id: 1,
      title: "Critical Analysis Essay",
      type: "text",
      created: "2023-04-15",
      submissions: 24,
      avgScore: 82,
    },
    {
      id: 2,
      title: "Python Sorting Algorithm",
      type: "code",
      created: "2023-04-12",
      submissions: 18,
      avgScore: 75,
    },
    {
      id: 3,
      title: "Calculus Problem Set",
      type: "math",
      created: "2023-04-10",
      submissions: 32,
      avgScore: 68,
    },
    {
      id: 4,
      title: "Research Notes Evaluation",
      type: "handwriting",
      created: "2023-04-08",
      submissions: 15,
      avgScore: 88,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "code":
        return <Code className="h-4 w-4 text-green-500" />;
      case "math":
        return <Calculator className="h-4 w-4 text-purple-500" />;
      case "handwriting":
        return <PenTool className="h-4 w-4 text-amber-500" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Assessments</h2>
          <p className="text-muted-foreground">
            Manage and view all your created assessments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Assessment
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assessments..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Avg. Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>{getTypeIcon(assessment.type)}</TableCell>
                <TableCell className="font-medium">{assessment.title}</TableCell>
                <TableCell className="capitalize">{assessment.type}</TableCell>
                <TableCell>{assessment.created}</TableCell>
                <TableCell>{assessment.submissions}</TableCell>
                <TableCell>{assessment.avgScore}%</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllAssessments;
