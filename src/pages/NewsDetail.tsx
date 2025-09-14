import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  ExternalLink,
  Share2,
  Bookmark,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsById, NewsItem } from "@/services/firebaseNewsService";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: () => fetchNewsById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    // Sayfa yüklendiğinde scroll'u en üste al
    window.scrollTo(0, 0);
  }, []);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title,
          text: news?.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: URL'yi kopyala
      await navigator.clipboard.writeText(window.location.href);
      // Toast göster
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Local storage'a kaydet
    const bookmarks = JSON.parse(localStorage.getItem('news-bookmarks') || '[]');
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== id);
      localStorage.setItem('news-bookmarks', JSON.stringify(newBookmarks));
    } else {
      localStorage.setItem('news-bookmarks', JSON.stringify([...bookmarks, id]));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Haber yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Card className="card-cyber max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Haber Bulunamadı
            </h2>
            <p className="text-muted-foreground mb-6">
              Aradığınız haber bulunamadı veya kaldırılmış olabilir.
            </p>
            <Button onClick={() => navigate('/news')} className="btn-cyber">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Haberlere Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-cyber text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/news')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Haberlere Dön
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className={`border-white/20 text-white hover:bg-white/10 ${
                  isBookmarked ? 'bg-white/20' : ''
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{news.image}</div>
              <div>
                <Badge className={getSeverityColor(news.severity)}>
                  {getSeverityText(news.severity)}
                </Badge>
                {news.isBreaking && (
                  <Badge className="bg-destructive/20 text-destructive border-destructive/20 ml-2">
                    Son Dakika
                  </Badge>
                )}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {news.title}
            </h1>
            
            <p className="text-xl opacity-90 mb-6">
              {news.summary}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{news.timeAgo}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{news.readTime} okuma</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{news.source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Ana İçerik */}
              <div className="lg:col-span-3">
                <Card className="card-cyber">
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none">
                      {/* Ana içerik */}
                      <div className="text-muted-foreground leading-relaxed mb-6">
                        {news.content && news.content !== news.summary ? (
                          <div dangerouslySetInnerHTML={{ __html: news.content }} />
                        ) : (
                          <p>{news.summary}</p>
                        )}
                      </div>
                      
                      {/* Detaylı açıklama */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-accent">Detaylı Analiz</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Bu haber, siber güvenlik alanındaki en güncel gelişmeleri kapsamaktadır. 
                          Güvenlik uzmanları, bu tür tehditlere karşı alınması gereken önlemler konusunda 
                          sürekli uyarılar yayınlamaktadır.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          Platformumuzda bu tür güvenlik açıkları ve tehditler hakkında daha fazla 
                          bilgi edinebilir, eğitim materyallerimizi inceleyebilir ve güvenlik araçlarımızı 
                          kullanarak sisteminizi test edebilirsiniz.
                        </p>
                        
                        {/* Orijinal kaynak linki */}
                        {news.url && (
                          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <h4 className="text-lg font-semibold text-accent mb-2">Orijinal Kaynak</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Bu haberin tam içeriğini orijinal kaynağından okuyabilirsiniz:
                            </p>
                            <Button
                              variant="outline"
                              asChild
                              className="w-full"
                            >
                              <a href={news.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Orijinal Haberi Oku
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Etiketler */}
                <Card className="card-matrix">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Etiketler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {news.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Kaynak Bilgisi */}
                <Card className="card-matrix">
                  <CardHeader>
                    <CardTitle className="text-lg">Kaynak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{news.source}</p>
                      <p className="text-sm text-muted-foreground">
                        Yayın Tarihi: {new Date(news.publishedAt).toLocaleDateString('tr-TR')}
                      </p>
                      {news.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <a href={news.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Orijinal Kaynağı Görüntüle
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* İlgili Haberler */}
                <Card className="card-matrix">
                  <CardHeader>
                    <CardTitle className="text-lg">İlgili Haberler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Bu kategoriye ait diğer haberleri görmek için ana sayfaya dönün.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/news')}
                        className="w-full"
                      >
                        Tüm Haberleri Gör
                      </Button>
                    </div>
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
