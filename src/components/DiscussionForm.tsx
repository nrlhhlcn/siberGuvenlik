import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Reply, Flag, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Discussion {
  id: number;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  replies: number;
  tags: string[];
}

const mockDiscussions: Discussion[] = [
  {
    id: 1,
    author: "Ahmet Yılmaz",
    avatar: "/placeholder.svg",
    title: "Web uygulamalarında XSS saldırılarından nasıl korunabiliriz?",
    content: "Merhaba arkadaşlar, web güvenliği konusunda öğrenmeye yeni başladım. XSS saldırıları hakkında detaylı bilgi arıyorum...",
    category: "Web Güvenliği",
    timestamp: "2 saat önce",
    likes: 15,
    replies: 8,
    tags: ["XSS", "Web Security", "Frontend"]
  },
  {
    id: 2,
    author: "Elif Kara",
    avatar: "/placeholder.svg",
    title: "Sızma testi araçları önerileri",
    content: "Penetration testing için hangi araçları önerirsiniz? Kali Linux'ta hangi araçlar en etkili?",
    category: "Penetration Testing",
    timestamp: "5 saat önce",
    likes: 23,
    replies: 12,
    tags: ["Penetration Testing", "Kali Linux", "Tools"]
  },
  {
    id: 3,
    author: "Mehmet Demir",
    avatar: "/placeholder.svg",
    title: "Ağ güvenliği için firewall konfigürasyonu",
    content: "Kurumsal ağlarda firewall yapılandırması konusunda deneyimli olan var mı? Best practice'ler neler?",
    category: "Ağ Güvenliği",
    timestamp: "1 gün önce",
    likes: 31,
    replies: 15,
    tags: ["Network Security", "Firewall", "Enterprise"]
  }
];

export const DiscussionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Tartışma başlatıldı!",
        description: "Sorunuz başarıyla gönderildi. Topluluk yakında yanıtlayacak.",
      });
      setFormData({ title: "", content: "", category: "", tags: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* New Discussion Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Yeni Tartışma Başlat
          </CardTitle>
          <CardDescription>
            Siber güvenlik konularında sorularınızı sorun ve toplulukla tartışın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  placeholder="Tartışma başlığını girin"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-security">Web Güvenliği</SelectItem>
                    <SelectItem value="network-security">Ağ Güvenliği</SelectItem>
                    <SelectItem value="penetration-testing">Sızma Testi</SelectItem>
                    <SelectItem value="cryptography">Kriptografi</SelectItem>
                    <SelectItem value="malware">Zararlı Yazılım</SelectItem>
                    <SelectItem value="general">Genel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <Textarea
                id="content"
                placeholder="Sorunuzu veya tartışma konunuzu detaylı bir şekilde açıklayın..."
                className="min-h-[120px]"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiketler</Label>
              <Input
                id="tags"
                placeholder="Etiketleri virgülle ayırın (örn: XSS, web security, frontend)"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Gönderiliyor..." : "Tartışmayı Başlat"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Discussions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Son Tartışmalar</h2>
          <Button variant="outline" size="sm">
            Tümünü Görüntüle
          </Button>
        </div>

        <div className="space-y-4">
          {mockDiscussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.avatar} alt={discussion.author} />
                    <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{discussion.author}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {discussion.timestamp}
                          </div>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {discussion.category}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-muted-foreground line-clamp-2">
                      {discussion.content}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Reply className="h-4 w-4" />
                        {discussion.replies} Yanıt
                      </Button>
                      <Button variant="ghost" size="sm">
                        Yanıtla
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};