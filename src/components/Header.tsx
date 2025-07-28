import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Shield, Menu, X, LogIn } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { LoginModal } from "./LoginModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Araçlar", path: "/tools" },
    { name: "Eğitim", path: "/training" },
    { name: "Haberler", path: "/news" },
    { name: "Quiz", path: "/quiz" },
    { name: "İletişim", path: "/contact" },
    { name: "SSS", path: "/faq" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 py-3" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
              <div className="absolute -inset-1 bg-gradient-cyber rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
            </div>
            <span className="text-xl font-bold text-gradient-cyber">
              CyberGuard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-accent ${
                  location.pathname === item.path
                    ? "text-accent"
                    : "text-foreground/80"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-cyber rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="btn-matrix"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsLoginOpen(true)}
              className="gap-2 btn-cyber hidden md:flex"
            >
              <LogIn className="h-4 w-4" />
              Giriş Yap
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden btn-matrix"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-accent"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="gap-2 btn-cyber mt-4"
              >
                <LogIn className="h-4 w-4" />
                Giriş Yap
              </Button>
            </div>
          </nav>
        )}
      </div>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};

export default Header;