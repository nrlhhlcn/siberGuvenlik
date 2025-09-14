import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ExternalLink, 
  User,
  Globe,
  AlertTriangle,
  Shield,
  TrendingUp,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLatestNews } from "@/services/rssService";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  link: string;
  pubDate: string;
  category: string;
  authorId: string;
  authorName: string;
  source: string;
  language: string;
  createdAt: any;
  severity?: string;
  image?: string;
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError("");
        
        const allNews = await getLatestNews();
        const foundNews = allNews.find(news => news.id === id);
        
        if (foundNews) {
          setNewsItem(foundNews);
        } else {
          setError("Haber bulunamadı.");
        }
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Haber yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Haber yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg text-destructive mb-4">{error || "Haber bulunamadı"}</p>
          <Button onClick={() => navigate('/news')} className="btn-cyber">
            Haberlere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-cyber text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/news')}
              className="text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Haberlere Dön
            </Button>
            <Badge className="bg-white/20 text-white">
              {getCategoryEmoji(newsItem.category)} {newsItem.category}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {newsItem.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{newsItem.authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatTimeAgo(newsItem.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getReadTime(newsItem.content)} okuma</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{newsItem.language === 'tr' ? 'Türkçe' : 'İngilizce'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="card-matrix">
                <CardContent className="p-8">
                  {/* Severity Badge */}
                  {newsItem.severity && (
                    <div className="mb-6">
                      <Badge className={getSeverityColor(newsItem.severity)}>
                        {getSeverityText(newsItem.severity)}
                      </Badge>
                    </div>
                  )}

                  {/* News Image */}
                  {newsItem.image && (
                    <div className="mb-6">
                      <img 
                        src={newsItem.image} 
                        alt={newsItem.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: newsItem.content.replace(/\n/g, '<br>') 
                      }}
                    />
                  </div>

                  {/* External Link */}
                  {newsItem.link && (
                    <div className="mt-8 pt-6 border-t">
                      <Button 
                        onClick={() => window.open(newsItem.link, '_blank')}
                        className="btn-cyber"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Orijinal Haberi Oku
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* News Info */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Newspaper className="h-5 w-5" />
                      Haber Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Kaynak</p>
                      <p className="font-medium">{newsItem.source}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kategori</p>
                      <Badge variant="outline" className="mt-1">
                        {getCategoryEmoji(newsItem.category)} {newsItem.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dil</p>
                      <p className="font-medium">
                        {newsItem.language === 'tr' ? 'Türkçe' : 'İngilizce'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yayın Tarihi</p>
                      <p className="font-medium">{formatTimeAgo(newsItem.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Actions */}
                <Card className="card-matrix">
                  <CardHeader>
                    <CardTitle className="text-lg">İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(newsItem.link, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Orijinal Kaynağı Aç
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/news')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Haberlere Dön
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
