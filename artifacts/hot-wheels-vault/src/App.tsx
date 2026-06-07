import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

import ScrollToTop from "@/components/ScrollToTop";
import AppLayout from "@/components/layout/AppLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import Home from "@/pages/Home";
import Collection from "@/pages/Collection";
import CarDetail from "@/pages/CarDetail";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminAddCar from "@/pages/admin/AddCar";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
        <h2 className="text-2xl font-bold tracking-widest text-primary neon-text uppercase">Loading Garage...</h2>
      </div>
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <div>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/">
            <AppLayout><Home /></AppLayout>
          </Route>
          <Route path="/collection">
            <AppLayout><Collection /></AppLayout>
          </Route>
          <Route path="/car/:id">
            {(params) => <AppLayout><CarDetail id={parseInt(params.id)} /></AppLayout>}
          </Route>
          <Route path="/admin/login">
            <AdminLogin />
          </Route>
          <Route path="/admin">
            <AdminLayout><AdminDashboard /></AdminLayout>
          </Route>
          <Route path="/admin/add">
            <AdminLayout><AdminAddCar /></AdminLayout>
          </Route>
          <Route>
            <AppLayout><NotFound /></AppLayout>
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <AnimatePresence>
            {loading ? (
              <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
            ) : null}
          </AnimatePresence>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
