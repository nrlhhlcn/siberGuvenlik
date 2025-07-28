import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-gradient-cyber">
                CyberGuard
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Siber güvenlik dünyasında güncel bilgiler, araçlar ve eğitimlerle 
              dijital güvenliğinizi artırın.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Güvenlik Araçları
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Eğitim Merkezi
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Güncel Haberler
                </Link>
              </li>
            </ul>
          </div>

          {/* Araçlar */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Popüler Araçlar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  IP Sorgulama
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Şifre Oluşturucu
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Hash Oluşturucu
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Port Tarayıcı
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">İletişim</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>E-posta: info@cyberguard.com</p>
              <p>Telefon: +90 (212) 555-0123</p>
              <p>Adres: İstanbul, Türkiye</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 CyberGuard. Tüm hakları saklıdır. | 
            <Link to="#" className="hover:text-accent transition-colors ml-2">
              Gizlilik Politikası
            </Link> | 
            <Link to="#" className="hover:text-accent transition-colors ml-2">
              Kullanım Şartları
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;