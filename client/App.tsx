import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Mood from "./pages/Mood";
import Chat from "./pages/Chat";
import Tasks from "./pages/Tasks";
import Fitness from "./pages/Fitness";
import Games from "./pages/Games";
import Sleep from "./pages/Sleep";
import Inspiration from "./pages/Inspiration";
import Journal from "./pages/Journal";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/games" element={<Games />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/journal" element={<Journal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
