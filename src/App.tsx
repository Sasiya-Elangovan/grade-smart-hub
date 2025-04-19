import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import TextAssessment from "./pages/assessment/TextAssessment";
import CodeAssessment from "./pages/assessment/CodeAssessment";
import HandwritingAssessment from "./pages/assessment/HandwritingAssessment";
import MathAssessment from "./pages/assessment/MathAssessment";
import AllAssessments from "./pages/assessment/AllAssessments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment/text" element={<TextAssessment />} />
            <Route path="/assessment/code" element={<CodeAssessment />} />
            <Route path="/assessment/handwriting" element={<HandwritingAssessment />} />
            <Route path="/assessment/math" element={<MathAssessment />} />
            <Route path="/assessments" element={<AllAssessments />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
