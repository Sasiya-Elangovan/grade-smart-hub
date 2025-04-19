
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./pages/dashboard/Dashboard";
import TextAssessment from "./pages/assessment/TextAssessment";
import CodeAssessment from "./pages/assessment/CodeAssessment";
import HandwritingAssessment from "./pages/assessment/HandwritingAssessment";
import MathAssessment from "./pages/assessment/MathAssessment";
import AllAssessments from "./pages/assessment/AllAssessments";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";
import AuthPage from "./pages/auth/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assessment/text" element={<TextAssessment />} />
              <Route path="/assessment/code" element={<CodeAssessment />} />
              <Route path="/assessment/handwriting" element={<HandwritingAssessment />} />
              <Route path="/assessment/math" element={<MathAssessment />} />
              <Route path="/assessments" element={<AllAssessments />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
