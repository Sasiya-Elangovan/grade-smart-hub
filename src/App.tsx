
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
import StudentAssessmentView from "./pages/assessment/StudentAssessmentView";
import StudentMathSubmission from "./pages/assessment/StudentMathSubmission";
import AssessmentResult from "./pages/assessment/AssessmentResult";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";
import AuthPage from "./pages/auth/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requireTeacher = false }: { children: React.ReactNode; requireTeacher?: boolean }) {
  const { user, loading, profile } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Check for teacher role if required
  if (requireTeacher && profile?.role !== 'teacher' && profile?.role !== 'admin') {
    return <Navigate to="/" />;
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
              
              {/* Teacher Routes */}
              <Route path="/assessment/text" element={
                <ProtectedRoute requireTeacher={true}>
                  <TextAssessment />
                </ProtectedRoute>
              } />
              <Route path="/assessment/code" element={
                <ProtectedRoute requireTeacher={true}>
                  <CodeAssessment />
                </ProtectedRoute>
              } />
              <Route path="/assessment/handwriting" element={
                <ProtectedRoute requireTeacher={true}>
                  <HandwritingAssessment />
                </ProtectedRoute>
              } />
              <Route path="/assessment/math" element={
                <ProtectedRoute requireTeacher={true}>
                  <MathAssessment />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/assessment/:type/:id" element={<StudentAssessmentView />} />
              <Route path="/assessment/math/:id" element={<StudentMathSubmission />} />
              <Route path="/assessment/result/:id" element={<AssessmentResult />} />
              
              {/* Common Routes */}
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
