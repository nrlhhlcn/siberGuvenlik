import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addNews, updateNews, deleteNews, fetchNews, NewsItem, syncRSSNewsToFirebase } from "@/services/firebaseNewsService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, Save, X, RefreshCw, Rss } from "lucide-react";
import { toast } from "sonner";

const AdminPanel = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "threats" as const,
    severity: "medium" as const,
    source: "",
    url: "",
    tags: "",
    isBreaking: false,
    isPublished: true
  });

  const queryClient = useQueryClient();

  // Haberleri getir
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => fetchNews(),
  });

  // Haber ekleme mutation
  const addMutation = useMutation({
    mutationFn: addNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      queryClient.invalidateQueries({ queryKey: ['news-counts'] });
      toast.success("Haber başarıyla eklendi!");
      resetForm();
    },
    onError: () => {
      toast.error("Haber eklenirken hata oluştu!");
    }
  });

  // Haber güncelleme mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<NewsItem> }) => updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      queryClient.invalidateQueries({ queryKey: ['news-counts'] });
      toast.success("Haber başarıyla güncellendi!");
      resetForm();
    },
    onError: () => {
      toast.error("Haber güncellenirken hata oluştu!");
    }
  });

  // Haber silme mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      queryClient.invalidateQueries({ queryKey: ['news-counts'] });
      toast.success("Haber başarıyla silindi!");
    },
    onError: () => {
      toast.error("Haber silinirken hata oluştu!");
    }
  });

  // RSS senkronizasyon mutation
  const syncRSSMutation = useMutation({
    mutationFn: syncRSSNewsToFirebase,
    onSuccess: (addedCount) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      queryClient.invalidateQueries({ queryKey: ['news-counts'] });
      toast.success(`${addedCount} yeni RSS haberi eklendi!`);
    },
    onError: () => {
      toast.error("RSS senkronizasyon hatası!");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      category: "threats",
      severity: "medium",
      source: "",
      url: "",
      tags: "",
      isBreaking: false,
      isPublished: true
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newsData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: getSecurityEmoji(formData.title),
      authorId: "admin",
      authorName: "Admin",
      publishedAt: new Date().toISOString()
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: newsData });
    } else {
      addMutation.mutate(newsData);
    }
  };

  const handleEdit = (news: NewsItem) => {
    setFormData({
      title: news.title,
      summary: news.summary,
      content: news.content,
      category: news.category,
      severity: news.severity,
      source: news.source,
      url: news.url,
      tags: news.tags.join(', '),
      isBreaking: news.isBreaking,
      isPublished: news.isPublished
    });
    setEditingId(news.id);
    setIsAdding(true);
  };

  const getSecurityEmoji = (title: string): string => {
    const text = title.toLowerCase();
    
    if (text.includes('ransomware')) return '🚨';
    if (text.includes('phishing')) return '🎣';
    if (text.includes('malware')) return '🦠';
    if (text.includes('vulnerability') || text.includes('cve')) return '🔧';
    if (text.includes('tool') || text.includes('software')) return '🛠️';
    if (text.includes('education') || text.includes('training')) return '📚';
    if (text.includes('report') || text.includes('study')) return '📊';
    if (text.includes('ai') || text.includes('artificial intelligence')) return '🤖';
    if (text.includes('cloud') || text.includes('container')) return '☁️';
    
    return '🛡️';
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-300">Siber güvenlik haberlerini yönetin</p>
        </div>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news">Haberler</TabsTrigger>
            <TabsTrigger value="add">Haber Ekle</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Tüm Haberler</h2>
              <div className="flex gap-3">
                <Button 
                  onClick={() => syncRSSMutation.mutate()}
                  disabled={syncRSSMutation.isPending}
                  variant="outline"
                  className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                >
                  <Rss className="w-4 h-4 mr-2" />
                  {syncRSSMutation.isPending ? 'Senkronize Ediliyor...' : 'RSS Senkronize Et'}
                </Button>
                <Button 
                  onClick={() => setIsAdding(true)}
                  className="btn-cyber"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Haber
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="text-gray-300 mt-4">Haberler yükleniyor...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {newsData?.news?.map((news) => (
                  <Card key={news.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg">{news.title}</CardTitle>
                          <CardDescription className="text-gray-300 mt-2">
                            {news.summary}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(news)}
                            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMutation.mutate(news.id)}
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
                          {news.viewCount} görüntülenme
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {news.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingId ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Başlık *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Haber başlığı..."
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kategori *
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="threats">Siber Tehditler</SelectItem>
                          <SelectItem value="updates">Güvenlik Güncellemeleri</SelectItem>
                          <SelectItem value="tools">Güvenlik Araçları</SelectItem>
                          <SelectItem value="education">Siber Güvenlik Eğitimi</SelectItem>
                          <SelectItem value="reports">Güvenlik Raporları</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Önem Derecesi *
                      </label>
                      <Select
                        value={formData.severity}
                        onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Yüksek</SelectItem>
                          <SelectItem value="medium">Orta</SelectItem>
                          <SelectItem value="low">Düşük</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kaynak
                      </label>
                      <Input
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        placeholder="Haber kaynağı..."
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL
                      </label>
                      <Input
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Özet *
                      </label>
                      <Textarea
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Haber özeti..."
                        rows={3}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        İçerik *
                      </label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Haber içeriği..."
                        rows={8}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Etiketler
                      </label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="etiket1, etiket2, etiket3..."
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.isBreaking}
                          onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                          className="rounded border-slate-600 bg-slate-700 text-accent"
                        />
                        <span className="text-gray-300">Son Dakika</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          className="rounded border-slate-600 bg-slate-700 text-accent"
                        />
                        <span className="text-gray-300">Yayınla</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      className="btn-cyber"
                      disabled={addMutation.isPending || updateMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Güncelle' : 'Kaydet'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
