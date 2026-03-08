import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import GardeningPage from "./pages/GardeningPage";
import WellnessPage from "./pages/WellnessPage";
import GuidesPageWrapper from "./pages/GuidesPageWrapper";
import PremiumPage from "./pages/PremiumPage";
import InstallPage from "./pages/InstallPage";
import DiaryPage from "./pages/DiaryPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PremiumProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jardineria" element={<GardeningPage />} />
              <Route path="/bienestar" element={<WellnessPage />} />
              <Route path="/guias" element={<GuidesPageWrapper />} />
              <Route path="/diario" element={<DiaryPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/instalar" element={<InstallPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </BrowserRouter>
        </PremiumProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
