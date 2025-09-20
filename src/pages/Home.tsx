import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Lock, 
  Eye, 
  BookOpen, 
  Newspaper, 
  Brain,
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { icon: Users, label: "Aktif Kullanıcı", value: "50,000+" },
    { icon: Shield, label: "Tamamlanan Tarama", value: "1.2M+" },
    { icon: Award, label: "Başarı Oranı", value: "99.9%" },
    { icon: TrendingUp, label: "Tespit Edilen Tehdit", value: "15K+" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Ücretsiz Güvenlik Araçları",
      description: "IP sorgulama, şifre oluşturma, hash kontrolü ve daha fazlası",
      link: "/tools",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      title: "Ücretsiz Eğitim Merkezi",
      description: "Tamamen ücretsiz siber güvenlik eğitimleri ve sertifika programları",
      link: "/training",
      color: "text-accent"
    },
    {
      icon: Newspaper,
      title: "Ücretsiz Güncel Haberler",
      description: "Son dakika siber güvenlik haberleri ve tehdit analizleri",
      link: "/news",
      color: "text-destructive"
    },
    {
      icon: Brain,
      title: "Ücretsiz Bilgi Testleri",
      description: "Siber güvenlik testleri ve dijital sertifikalar",
      link: "/quiz",
      color: "text-cyan-400"
    }
  ];

  const recentNews = [
    {
      title: "Yeni Ransomware Saldırısı Tespit Edildi",
      summary: "Kritik altyapıyı hedef alan yeni ransomware türü...",
      date: "2 saat önce",
      category: "Tehdit Analizi"
    },
    {
      title: "Yapay Zeka Destekli Güvenlik Çözümleri",
      summary: "ML algoritmaları ile gelişmiş tehdit tespiti...",
      date: "6 saat önce",
      category: "Teknoloji"
    },
    {
      title: "Zero-Day Açık Kapatıldı",
      summary: "Kritik seviyedeki güvenlik açığı için patch yayınlandı...",
      date: "1 gün önce",
      category: "Güvenlik Güncellemesi"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="min-h-screen">
       {/* Hero Section */}
       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
         <div 
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80" />
         
         <div className="relative z-10 container mx-auto px-4 text-center">
           <div className="max-w-4xl mx-auto space-y-8">
             <h1 className="text-6xl md:text-8xl font-bold">
               <span className="text-gradient-cyber animate-slide-down">Shield</span>
               <br />
               <span className="text-gradient-matrix animate-slide-up">Platform</span>
             </h1>
             
             <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
               Dijital dünyada güvenliğinizi artırmak için gereken 
               <span className="text-accent font-semibold"> tamamen ücretsiz </span>
               araçlar, eğitimler ve güncel bilgiler tek platformda.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
               <Button size="lg" className="btn-cyber hover-scale">
                 <span>Araçları Keşfet</span>
                 <ArrowRight className="ml-2 h-5 w-5 animate-pulse-glow" />
               </Button>
               <Button size="lg" variant="outline" className="btn-matrix hover-scale">
                 Eğitimlere Başla
               </Button>
             </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className={`card-cyber p-4 transition-all duration-500 animate-slide-up hover-scale ${
                      currentStat === index ? 'animate-pulse-glow scale-105' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-8 w-8 text-accent mx-auto mb-2 animate-float" />
                    <div className="text-2xl font-bold text-gradient-cyber animate-heartbeat">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

       {/* Özellikler */}
       <section className="py-20 bg-gradient-matrix">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-gradient-cyber mb-4">
               Kapsamlı Güvenlik Platformu
             </h2>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
               Modern araçlar, uzman eğitimler ve güncel haberlerle 
               siber güvenlik yolculuğunuzda yanınızdayız.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {features.map((feature, index) => {
               const Icon = feature.icon;
               return (
                 <Link 
                   key={index}
                   to={feature.link}
                   className="card-cyber group hover-lift animate-slide-up"
                   style={{ animationDelay: `${index * 0.2}s` }}
                 >
                   <CardHeader>
                     <Icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:animate-cyber-pulse animate-rotate-in`} />
                     <CardTitle className="text-xl group-hover:text-accent transition-colors">
                       {feature.title}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <CardDescription className="text-muted-foreground">
                       {feature.description}
                     </CardDescription>
                   </CardContent>
                 </Link>
               );
             })}
           </div>
         </div>
       </section>

      {/* Son Haberler */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-cyber">
              Son Dakika Haberleri
            </h2>
            <Link to="/news">
              <Button variant="outline" className="btn-matrix">
                Tümünü Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentNews.map((news, index) => (
              <Card key={index} className="card-cyber hover-lift group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded-full">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {news.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-accent transition-colors">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {news.summary}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-cyber text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
             <h2 className="text-4xl font-bold">
               Güvenlik Yolculuğunuza Bugün Başlayın
             </h2>
            <p className="text-xl opacity-90">
              Araçlar, eğitimler ve kaynaklarla 
              dijital güvenliğinizi bir sonraki seviyeye taşıyın. Hiçbir ücret yok!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Lock className="mr-2 h-5 w-5" />
                Hesap Oluştur
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Eye className="mr-2 h-5 w-5" />
                Demo İzle
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;