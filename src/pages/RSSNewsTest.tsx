import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchRSSNews, fetchSingleRSSFeed, RSSNewsItem } from "@/services/rssService";
import { useQuery } from "@tanstack/react-query";
import { Rss, RefreshCw, ExternalLink, Clock, User, Tag } from "lucide-react";

const RSSNewsTest = () => {
  const [selectedFeed, setSelectedFeed] = useState<string>("");

  // Tüm RSS haberlerini çek
  const { data: allRSSNews = [], isLoading: rssLoading, refetch: refetchRSS } = useQuery({
    queryKey: ['rss-news'],
    queryFn: fetchRSSNews,
    staleTime: 2 * 60 * 1000, // 2 dakika
  });

  // Tek feed'den haber çek
  const { data: singleFeedNews = [], isLoading: singleFeedLoading } = useQuery({
    queryKey: ['single-rss-feed', selectedFeed],
    queryFn: () => fetchSingleRSSFeed(selectedFeed),
    enabled: !!selectedFeed,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'threats': return 'bg-red-100 text-red-800';
      case 'updates': return 'bg-blue-100 text-blue-800';
      case 'tools': return 'bg-green-100 text-green-800';
      case 'education': return 'bg-purple-100 text-purple-800';
      case 'reports': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const rssFeeds = [
    { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
    { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
    { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
    { name: "Security Week", url: "https://www.securityweek.com/rss" },
    { name: "Threat Post", url: "https://threatpost.com/feed/" },
    { name: "Bleeping Computer", url: "https://www.bleepingcomputer.com/feed/" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">RSS Haber Test Sayfası</h1>
          <p className="text-gray-300">RSS feed'lerden haberleri test edin ve görüntüleyin</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tüm RSS Haberleri</TabsTrigger>
            <TabsTrigger value="single">Tek Feed Test</TabsTrigger>
            <TabsTrigger value="stats">İstatistikler</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Tüm RSS Haberleri</h2>
              <Button 
                onClick={() => refetchRSS()}
                disabled={rssLoading}
                className="btn-cyber"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${rssLoading ? 'animate-spin' : ''}`} />
                Yenile
              </Button>
            </div>

            {rssLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="text-gray-300 mt-4">RSS haberleri yükleniyor...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {allRSSNews.map((news) => (
                  <Card key={news.id} className="bg-slate-800 border-slate-700 hover:border-accent transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-2">{news.title}</CardTitle>
                          <CardDescription className="text-gray-300 mb-3">
                            {news.summary}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {news.source}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {news.timeAgo}
                            </div>
                            <div className="flex items-center gap-1">
                              <Rss className="w-4 h-4" />
                              {news.feedName}
                            </div>
                          </div>
                        </div>
                        <div className="text-4xl ml-4">
                          {news.image}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={getCategoryColor(news.category)}>
                          {news.category}
                        </Badge>
                        <Badge className={getSeverityColor(news.severity)}>
                          {news.severity}
                        </Badge>
                        {news.isBreaking && (
                          <Badge className="bg-red-500 text-white">
                            Son Dakika
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-gray-300">
                          {news.readTime}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {news.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Dil: {news.language.toUpperCase()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(news.url, '_blank')}
                          className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Orijinal Haberi Gör
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="single" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Tek Feed Test</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {rssFeeds.map((feed) => (
                  <Button
                    key={feed.url}
                    variant={selectedFeed === feed.url ? "default" : "outline"}
                    onClick={() => setSelectedFeed(feed.url)}
                    className="text-left justify-start"
                  >
                    <Rss className="w-4 h-4 mr-2" />
                    {feed.name}
                  </Button>
                ))}
              </div>
            </div>

            {selectedFeed && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">
                    {rssFeeds.find(f => f.url === selectedFeed)?.name} Haberleri
                  </h3>
                  <Button
                    onClick={() => setSelectedFeed("")}
                    variant="outline"
                    size="sm"
                  >
                    Temizle
                  </Button>
                </div>

                {singleFeedLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                    <p className="text-gray-300 mt-2">Feed yükleniyor...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {singleFeedNews.map((news) => (
                      <Card key={news.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-2">{news.title}</h4>
                              <p className="text-gray-300 text-sm mb-3">{news.summary}</p>
                              <div className="flex gap-2">
                                <Badge className={getCategoryColor(news.category)}>
                                  {news.category}
                                </Badge>
                                <Badge className={getSeverityColor(news.severity)}>
                                  {news.severity}
                                </Badge>
                                {news.isBreaking && (
                                  <Badge className="bg-red-500 text-white">
                                    Son Dakika
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-2xl ml-4">
                              {news.image}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">RSS İstatistikleri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Toplam Haber</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{allRSSNews.length}</div>
                  <p className="text-gray-400 text-sm">RSS feed'lerden çekilen haber sayısı</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Aktif Feed'ler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{rssFeeds.length}</div>
                  <p className="text-gray-400 text-sm">Toplam RSS feed sayısı</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Son Dakika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">
                    {allRSSNews.filter(n => n.isBreaking).length}
                  </div>
                  <p className="text-gray-400 text-sm">Son dakika haber sayısı</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Kategori Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['threats', 'updates', 'tools', 'education', 'reports'].map((category) => {
                    const count = allRSSNews.filter(n => n.category === category).length;
                    return (
                      <div key={category} className="text-center">
                        <div className="text-2xl font-bold text-accent">{count}</div>
                        <div className="text-sm text-gray-400 capitalize">{category}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RSSNewsTest;
