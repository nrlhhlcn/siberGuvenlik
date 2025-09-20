import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Training from "./pages/Training";
import CourseDetail from "./pages/CourseDetail";
import CourseOverview from "./pages/CourseOverview";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Quiz from "./pages/Quiz";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Lock, Shield, ArrowRight } from "lucide-react";

const queryClient = new QueryClient();

// Blur overlay bileşeni
const BlurOverlay = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blur efekti */}
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-center space-y-6 p-8 bg-gray-900/90 rounded-lg border border-gray-700 max-w-md mx-4">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Giriş Gerekli
            </h2>
            <p className="text-gray-300">
              Bu içeriğe erişmek için lütfen giriş yapın veya hesap oluşturun.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 w-full"
              onClick={() => window.location.href = '/login'}
            >
              <Shield className="w-4 h-4 mr-2" />
              Giriş Yap
            </Button>
            
            <p className="text-gray-400 text-sm">
              Hesabınız yok mu?{' '}
              <button 
                className="text-cyan-400 hover:text-cyan-300 underline"
                onClick={() => window.location.href = '/register'}
              >
                Kayıt Ol
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ana uygulama bileşeni
const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Korumalı rotalar - blur efekti ile */}
          <Route path="/tools" element={
            <BlurOverlay>
              <Tools />
            </BlurOverlay>
          } />
          <Route path="/training" element={
            <BlurOverlay>
              <Training />
            </BlurOverlay>
          } />
          <Route path="/course/:courseId" element={
            <BlurOverlay>
              <CourseDetail />
            </BlurOverlay>
          } />
          <Route path="/course/:courseId/overview" element={
            <BlurOverlay>
              <CourseOverview />
            </BlurOverlay>
          } />
          <Route path="/course/:courseId/module/:moduleIndex/lesson/:lessonIndex" element={
            <BlurOverlay>
              <CourseDetail />
            </BlurOverlay>
          } />
          <Route path="/news" element={
            <BlurOverlay>
              <News />
            </BlurOverlay>
          } />
          <Route path="/news/:id" element={
            <BlurOverlay>
              <NewsDetail />
            </BlurOverlay>
          } />
          <Route path="/quiz" element={
            <BlurOverlay>
              <Quiz />
            </BlurOverlay>
          } />
          <Route path="/contact" element={
            <BlurOverlay>
              <Contact />
            </BlurOverlay>
          } />
          <Route path="/faq" element={
            <BlurOverlay>
              <FAQ />
            </BlurOverlay>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="cyber-security-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
