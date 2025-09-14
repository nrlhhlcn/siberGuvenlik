import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Newspaper, 
  Clock, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/firebase";
import { getLatestNews } from "@/services/rssService";
import { shuffleArray } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  severity?: string;
  readTime?: string;
  source?: string;
  image?: string;
}

const News = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [shuffledNews, setShuffledNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const newsCategories = [
    { id: "all", name: "Tüm Haberler", count: 0 },
    { id: "threats", name: "Tehditler", count: 0 },
    { id: "updates", name: "Güncellemeler", count: 0 },
    { id: "tools", name: "Araçlar", count: 0 },
    { id: "education", name: "Eğitim", count: 0 },
    { id: "reports", name: "Raporlar", count: 0 }
  ];

  // RSS feed'lerden haberleri çek
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");
      
      const newsData = await getLatestNews();
      setNews(newsData);

      // Yeni haberleri kontrol et (son 24 saat içindeki haberler)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newNews = newsData.filter(item => {
        const newsDate = new Date(item.createdAt);
        return newsDate > oneDayAgo;
      });

      // Yeni haberler varsa onları önce göster, yoksa karıştır
      if (newNews.length > 0) {
        console.log(`${newNews.length} yeni haber bulundu (son 24 saat), önce gösteriliyor`);
        // Yeni haberler + eski haberler (karıştırılmış)
        const oldNews = newsData.filter(item => !newNews.includes(item));
        const shuffledOldNews = shuffleArray(oldNews);
        const finalNews = [...newNews, ...shuffledOldNews].filter(item => item !== undefined);
        console.log(`Toplam ${finalNews.length} haber: ${newNews.length} yeni + ${shuffledOldNews.length} eski (karışık)`);
        setShuffledNews(finalNews);
      } else {
        console.log('Yeni haber yok, tüm haberler karıştırılıyor');
        const shuffledAll = shuffleArray(newsData).filter(item => item !== undefined);
        console.log(`${shuffledAll.length} haber karıştırıldı`);
        setShuffledNews(shuffledAll);
      }
      
      // Kategori sayılarını güncelle
      newsCategories.forEach(category => {
        if (category.id === "all") {
          category.count = newsData.length;
        } else {
          category.count = newsData.filter(item => item.category === category.id).length;
        }
      });
      
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Haberler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Manuel RSS güncelleme
  const handleManualUpdate = async () => {
    try {
      setUpdating(true);
      await fetchNews(); // Yeni haberleri çek
      setCurrentPage(1); // İlk sayfaya dön
    } catch (error) {
      console.error('Error updating RSS feeds:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Kategori değiştiğinde ilk sayfaya dön
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Arama değiştiğinde ilk sayfaya dön
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Yardımcı fonksiyonlar
  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Bilinmiyor";
    
    const now = new Date();
    const newsTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - newsTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Az önce";
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return `${Math.floor(diffInMinutes / 1440)} gün önce`;
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} dk`;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      threats: "🚨",
      updates: "🔧", 
      tools: "🛠️",
      education: "📚",
      reports: "📊"
    };
    return emojis[category] || "📰";
  };

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

  const filteredNews = shuffledNews.filter(newsItem => {
    // Undefined kontrolü
    if (!newsItem || !newsItem.title || !newsItem.content) {
      return false;
    }
    
    const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsItem.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || newsItem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonları
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const breakingNews = shuffledNews.filter(item => item.severity === "high").slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Haberler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg text-destructive mb-4">{error}</p>
          <Button onClick={fetchNews} className="btn-cyber">
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

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
            {breakingNews.length > 0 ? (
              breakingNews.map((newsItem, index) => (
                <Card key={newsItem.id} className="card-cyber hover-lift group border-destructive/20 animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl animate-float">{getCategoryEmoji(newsItem.category)}</div>
                      <Badge className={getSeverityColor(newsItem.severity || "high")}>
                        {getSeverityText(newsItem.severity || "high")}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors line-clamp-2">
                      {newsItem.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {newsItem.content.substring(0, 150)}...
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 animate-pulse-glow" />
                        <span>{formatTimeAgo(newsItem.createdAt)}</span>
                      </div>
                      <span>{getReadTime(newsItem.content)} okuma</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Henüz kritik haber bulunmuyor.</p>
              </div>
            )}
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleManualUpdate}
                disabled={updating}
                variant="outline"
                size="sm"
                className="btn-matrix"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Haberleri Yenile
                  </>
                )}
              </Button>
              {newsCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className={selectedCategory === category.id ? "btn-cyber" : "btn-matrix"}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Haber Listesi */}
          <div className="space-y-6">
            {currentNews.length > 0 ? (
              currentNews.map((newsItem) => (
                <Card 
                  key={newsItem.id} 
                  className="card-matrix hover-lift group cursor-pointer"
                  onClick={() => navigate(`/news/${newsItem.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl flex-shrink-0">{getCategoryEmoji(newsItem.category)}</div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 
                            className="text-xl font-semibold group-hover:text-accent transition-colors line-clamp-2 cursor-pointer hover:underline"
                            onClick={() => navigate(`/news/${newsItem.id}`)}
                          >
                            {newsItem.title}
                          </h3>
                          <Badge className={getSeverityColor(newsItem.severity || "low")}>
                            {getSeverityText(newsItem.severity || "low")}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground line-clamp-2">
                          {newsItem.content.substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatTimeAgo(newsItem.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{getReadTime(newsItem.content)}</span>
                            </div>
                            <span className="text-accent">{newsItem.authorName}</span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="btn-matrix"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/news/${newsItem.id}`);
                            }}
                          >
                            <span>Devamını Oku</span>
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Haber Bulunamadı</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Arama kriterlerinize uygun haber bulunamadı." : "Bu kategoride henüz haber bulunmuyor."}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline">
                    Aramayı Temizle
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-12">
              {/* Sayfa Bilgisi */}
              <div className="text-sm text-muted-foreground">
                Sayfa {currentPage} / {totalPages} - Toplam {filteredNews.length} haber
              </div>
              
              {/* Pagination Butonları */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="btn-matrix"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Önceki
                </Button>
                
                {/* Sayfa Numaraları */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={currentPage === pageNum ? "btn-cyber" : "btn-matrix"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="btn-matrix"
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
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
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 relative z-10"
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