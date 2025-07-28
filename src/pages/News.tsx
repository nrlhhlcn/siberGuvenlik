import { useState, useEffect } from "react";
import { 
  Newspaper, 
  Clock, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const newsCategories = [
    { id: "all", name: "Tüm Haberler", count: 45 },
    { id: "threats", name: "Tehditler", count: 12 },
    { id: "updates", name: "Güncellemeler", count: 8 },
    { id: "tools", name: "Araçlar", count: 7 },
    { id: "education", name: "Eğitim", count: 6 },
    { id: "reports", name: "Raporlar", count: 12 }
  ];

  const breakingNews = [
    {
      id: "1",
      title: "Yeni Ransomware Saldırısı: LockBit 3.0 Tespit Edildi",
      summary: "Kritik altyapıları hedef alan yeni ransomware türü tespit edildi. Uzmanlar acil güvenlik önlemleri alınmasını tavsiye ediyor.",
      category: "threats",
      severity: "high",
      timeAgo: "15 dakika önce",
      readTime: "3 dk",
      source: "CyberGuard Security Lab",
      image: "🚨"
    },
    {
      id: "2", 
      title: "Microsoft Kritik Güvenlik Açığını Kapattı",
      summary: "Windows ve Office ürünlerini etkileyen zero-day açığı için acil güncelleme yayınlandı.",
      category: "updates",
      severity: "medium",
      timeAgo: "2 saat önce", 
      readTime: "2 dk",
      source: "Microsoft Security Blog",
      image: "🔧"
    },
    {
      id: "3",
      title: "Ücretsiz Güvenlik Tarayıcı Aracı Güncellendi",
      summary: "Popüler açık kaynak güvenlik tarayıcısına yeni özellikler eklendi. Şimdi daha hızlı ve etkili.",
      category: "tools",
      severity: "low",
      timeAgo: "4 saat önce",
      readTime: "2 dk", 
      source: "Open Security Community",
      image: "🛠️"
    }
  ];

  const allNews = [
    ...breakingNews,
    {
      id: "4",
      title: "Yapay Zeka Destekli Siber Saldırılar Artışta",
      summary: "2024 yılında AI destekli saldırıların %300 arttığı raporlandı. Uzmanlar savunma stratejilerini gözden geçirmeyi öneriyor.",
      category: "reports", 
      severity: "medium",
      timeAgo: "6 saat önce",
      readTime: "5 dk",
      source: "Cybersecurity Research Institute",
      image: "🤖"
    },
    {
      id: "5",
      title: "Ücretsiz Siber Güvenlik Eğitim Serisi Başlıyor",
      summary: "Türkiye'nin en kapsamlı ücretsiz siber güvenlik eğitim programı 1 Mart'ta başlıyor. Kayıtlar açık.",
      category: "education",
      severity: "low", 
      timeAgo: "8 saat önce",
      readTime: "3 dk",
      source: "CyberGuard Eğitim",
      image: "📚"
    },
    {
      id: "6",
      title: "Phishing Saldırıları %250 Arttı",
      summary: "Son 3 ayda phishing saldırılarında dramatik artış gözlemlendi. E-posta güvenliği önlemleri kritik hale geldi.",
      category: "threats",
      severity: "high",
      timeAgo: "12 saat önce", 
      readTime: "4 dk",
      source: "Anti-Phishing Working Group",
      image: "🎣"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20"; 
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high": return "Yüksek Risk";
      case "medium": return "Orta Risk";
      case "low": return "Düşük Risk";
      default: return "Bilinmiyor";
    }
  };

  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Breaking News Animation */}
        <div className="absolute top-20 left-0 right-0 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-destructive/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm text-destructive font-semibold">CANLI</span>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/3 right-10 w-20 h-20 bg-destructive/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Newspaper className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
            <span className="text-gradient-cyber">Güvenlik Haberleri</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Siber güvenlik dünyasından son dakika haberleri, tehdit analizleri ve güvenlik uyarıları
          </p>
          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <div className="flex items-center gap-2 text-accent animate-pulse-glow">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm">Canlı Güncelleme</span>
            </div>
            <div className="flex items-center gap-2 text-primary animate-pulse-glow">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm">7/24 İzleme</span>
            </div>
          </div>
        </div>
      </section>

      {/* Son Dakika Haberleri */}
      <section className="py-12 bg-destructive/5 border-y border-destructive/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-destructive animate-pulse" />
            <h2 className="text-2xl font-bold text-destructive">Son Dakika</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breakingNews.map((news, index) => (
              <Card key={news.id} className="card-cyber hover-lift group border-destructive/20 animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl animate-float">{news.image}</div>
                    <Badge className={getSeverityColor(news.severity)}>
                      {getSeverityText(news.severity)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-accent transition-colors line-clamp-2">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {news.summary}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 animate-pulse-glow" />
                      <span>{news.timeAgo}</span>
                    </div>
                    <span>{news.readTime} okuma</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ana Haberler */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Arama ve Filtreleme */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Haberlerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {newsCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "btn-cyber" : "btn-matrix"}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Haber Listesi */}
          <div className="space-y-6">
            {filteredNews.map((news) => (
              <Card key={news.id} className="card-matrix hover-lift group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">{news.image}</div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-semibold group-hover:text-accent transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <Badge className={getSeverityColor(news.severity)}>
                          {getSeverityText(news.severity)}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2">
                        {news.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{news.timeAgo}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{news.readTime}</span>
                          </div>
                          <span className="text-accent">{news.source}</span>
                        </div>
                        
                        <Button variant="outline" size="sm" className="btn-matrix">
                          <span>Devamını Oku</span>
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Yükleme Butonu */}
          <div className="text-center mt-12">
            <Button className="btn-cyber">
              <span>Daha Fazla Haber Yükle</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Ücretsiz Bildirim Aboneliği */}
      <section className="py-16 bg-gradient-cyber text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Haber Bildirimlerine Abone Olun
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Kritik güvenlik haberlerini ilk siz öğrenin.
          </p>
          <div className="max-w-md mx-auto flex space-x-2">
            <Input 
              placeholder="E-posta adresiniz"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button variant="secondary">
              Abone Ol
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;