import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PremiumProvider } from "@/contexts/PremiumContext";
import Index from "./pages/Index";
import GardeningPage from "./pages/GardeningPage";
import WellnessPage from "./pages/WellnessPage";
import GuidesPageWrapper from "./pages/GuidesPageWrapper";
import PremiumPage from "./pages/PremiumPage";
import InstallPage from "./pages/InstallPage";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PremiumProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jardineria" element={<GardeningPage />} />
            <Route path="/bienestar" element={<WellnessPage />} />
            <Route path="/guias" element={<GuidesPageWrapper />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/instalar" element={<InstallPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </PremiumProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
