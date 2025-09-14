import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { auth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Şifre kontrolü
      if (formData.password !== formData.confirmPassword) {
        setError("Şifreler eşleşmiyor");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Şifre en az 6 karakter olmalıdır");
        setIsLoading(false);
        return;
      }

      // Firebase ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Kullanıcı adını güncelle
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      toast({
        title: "Hesap oluşturuldu!",
        description: "CyberGuard'a hoş geldiniz!",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Bu e-posta adresi zaten kullanımda.";
          break;
        case "auth/weak-password":
          errorMessage = "Şifre çok zayıf. Daha güçlü bir şifre seçin.";
          break;
        case "auth/invalid-email":
          errorMessage = "Geçersiz e-posta adresi.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      toast({
        title: "Kayıt başarılı!",
        description: "Google hesabınızla kayıt yapıldı.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Google auth error:", error);
      
      let errorMessage = "Google ile kayıt yapılırken bir hata oluştu.";
      
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Kayıt işlemi iptal edildi.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup engellendi. Lütfen popup'ları etkinleştirin.";
      }
      
      setError(errorMessage);
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary" />
              <div className="absolute -inset-4 bg-gradient-cyber rounded-full opacity-20 blur-sm" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            CyberGuard'a Hoş Geldiniz
          </h1>
          <p className="text-muted-foreground text-lg">
            Siber güvenlik yolculuğunuza başlayın
          </p>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Yeni Hesap Oluşturun</CardTitle>
            <CardDescription className="text-center text-base">
              CyberGuard topluluğuna katılın ve siber güvenlik yolculuğunuza başlayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Ad Soyad</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors z-10" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız ve soyadınız"
                    className="pl-10 h-12 bg-background/60 border-border/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all duration-200 relative z-20 rounded-lg"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">E-posta</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    className="pl-10 h-12 bg-background/60 border-border/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all duration-200 relative z-20 rounded-lg"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Şifre</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Güçlü bir şifre oluşturun"
                    className="pl-10 pr-10 h-12 bg-background/60 border-border/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all duration-200 relative z-20 rounded-lg"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-accent transition-colors z-30"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Şifre Tekrar</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrenizi tekrar girin"
                    className="pl-10 pr-10 h-12 bg-background/60 border-border/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all duration-200 relative z-20 rounded-lg"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-accent transition-colors z-30"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Kayıt oluşturuluyor...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Hesap Oluştur
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8">
              <Separator className="my-6 bg-border/50" />
              <Button 
                variant="outline" 
                className="w-full h-12 bg-background/60 border-border/60 hover:bg-background/80 hover:border-accent/60 transition-all duration-200 rounded-lg" 
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile Kayıt Ol
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link 
                  to="/login" 
                  className="text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
