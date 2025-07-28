import { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Search,
  Shield,
  BookOpen,
  Settings,
  CreditCard,
  Users,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "Tümü", icon: HelpCircle, count: 24 },
    { id: "general", name: "Genel", icon: Shield, count: 8 },
    { id: "tools", name: "Araçlar", icon: Settings, count: 6 },
    { id: "education", name: "Eğitim", icon: BookOpen, count: 5 },
    { id: "pricing", name: "Ücretlendirme", icon: CreditCard, count: 3 },
    { id: "account", name: "Hesap", icon: Users, count: 2 }
  ];

  const faqData = [
    {
      id: "1",
      category: "general",
      question: "Tüm araçlar ve eğitimler gerçekten ücretsiz mi?",
      answer: "Evet! Platformumuzdaki tüm araçlar, eğitim materyalleri, testler ve sertifikalar tamamen ücretsizdir. Hiçbir ücret talep etmiyoruz ve gizli ücret de yoktur. Misyonumuz siber güvenlik eğitimini herkese erişilebilir kılmaktır.",
      tags: ["ücretsiz", "ücret"],
      popular: true
    },
    {
      id: "2",
      category: "tools",
      question: "IP sorgulama aracı nasıl kullanılır?",
      answer: "Araçlar sayfasından IP sorgulama bölümüne gidin, sorgulamak istediğiniz IP adresini girin ve 'Sorgula' butonuna tıklayın. Araç size IP'nin coğrafi konumu, ISP bilgileri ve güvenlik durumu hakkında detaylı bilgi verecektir.",
      tags: ["ip", "sorgulama", "araç"],
      popular: true
    },
    {
      id: "3",
      category: "education",
      question: "Sertifikalar nasıl alınır?",
      answer: "Quiz bölümündeki testleri %70 ve üzeri başarı ile tamamladığınızda otomatik olarak dijital sertifikanızı alabilirsiniz. Sertifika indirme linki test sonucu sayfasında görünecektir. Tüm sertifikalar tamamen ücretsizdir.",
      tags: ["sertifika", "test", "quiz"],
      popular: true
    },
    {
      id: "4",
      category: "general",
      question: "Hangi tarayıcılar desteklenir?",
      answer: "Chrome, Firefox, Safari, Edge gibi modern tarayıcıların güncel sürümlerini destekliyoruz. En iyi deneyim için tarayıcınızı güncel tutmanızı öneriyoruz.",
      tags: ["tarayıcı", "uyumluluk"],
      popular: false
    },
    {
      id: "5",
      category: "tools",
      question: "Şifre oluşturucu ne kadar güvenli?",
      answer: "Şifre oluşturucumuz kriptografik olarak güvenli rastgele sayı üreticileri kullanır. Oluşturulan şifreler sunucularımızda saklanmaz ve tamamen istemci tarafında oluşturulur.",
      tags: ["şifre", "güvenlik", "rastgele"],
      popular: false
    },
    {
      id: "6",
      category: "education",
      question: "Eğitim içerikleri ne sıklıkla güncellenir?",
      answer: "Eğitim içeriklerimizi ayda en az bir kez gözden geçirir ve siber güvenlik alanındaki gelişmelere göre güncelliyoruz. Yeni tehditler ve teknolojilerle ilgili içerikler düzenli olarak eklenir.",
      tags: ["eğitim", "güncelleme", "içerik"],
      popular: false
    },
    {
      id: "7",
      category: "pricing",
      question: "Gelecekte ücretli özellikler eklenecek mi?",
      answer: "Hayır! Temel misyonumuz ücretsiz siber güvenlik eğitimi sunmaktır. Tüm mevcut ve gelecek özelliklerimiz ücretsiz olmaya devam edecektir. Bu konudaki taahhüdümüz değişmeyecektir.",
      tags: ["ücretli", "gelecek", "politika"],
      popular: true
    },
    {
      id: "8",
      category: "account",
      question: "Hesap oluşturmak zorunlu mu?",
      answer: "Hayır, çoğu araç ve içeriği hesap oluşturmadan kullanabilirsiniz. Ancak ilerlemelerinizi takip etmek, sertifika almak ve kişiselleştirilmiş deneyim için ücretsiz hesap oluşturmanızı öneriyoruz.",
      tags: ["hesap", "kayıt", "zorunlu"],
      popular: false
    },
    {
      id: "9",
      category: "tools",
      question: "Hash oluşturucu hangi algoritmaları destekler?",
      answer: "MD5, SHA-1, SHA-256, SHA-512 gibi yaygın hash algoritmalarını destekliyoruz. Her algoritmanın güvenlik seviyesi farklıdır, güvenlik açısından SHA-256 ve üzeri önerilir.",
      tags: ["hash", "algoritma", "şifreleme"],
      popular: false
    },
    {
      id: "10",
      category: "general",
      question: "Mobil cihazlarda kullanılabilir mi?",
      answer: "Evet! Platformumuz mobil uyumlu tasarıma sahiptir. Telefonunuzdan veya tabletinizden tüm özellikleri kullanabilirsiniz.",
      tags: ["mobil", "responsive", "tablet"],
      popular: false
    }
  ];

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQ = faqData.filter(item => item.popular);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-accent/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-cyber-blue/20 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <HelpCircle className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
            <span className="text-gradient-cyber">Sıkça Sorulan Sorular</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Platformumuz hakkında merak ettiğiniz her şey burada. 
            Aradığınızı bulamazsanız <span className="text-accent font-semibold">ücretsiz destek</span> ekibimizle iletişime geçin.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm animate-slide-up">
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-accent animate-heartbeat">❓</span>
              <span>Kapsamlı SSS</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-primary animate-heartbeat">🔍</span>
              <span>Hızlı Arama</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-cyan-400 animate-heartbeat">💡</span>
              <span>Detaylı Yanıtlar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Arama ve Filtreler */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Arama Çubuğu */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Sorularınızı arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>

            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "btn-cyber" : "btn-matrix"}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name} ({category.count})
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Sorular */}
      {selectedCategory === "all" && !searchTerm && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gradient-cyber mb-6 text-center">
                En Popüler Sorular
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularFAQ.map((item) => (
                  <Card key={item.id} className="card-cyber hover-lift group">
                    <Collapsible
                      open={openItems.includes(item.id)}
                      onOpenChange={() => toggleItem(item.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                                  Popüler
                                </Badge>
                              </div>
                              <CardTitle className="text-lg group-hover:text-accent transition-colors text-left">
                                {item.question}
                              </CardTitle>
                            </div>
                            {openItems.includes(item.id) ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tüm Sorular */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient-cyber">
                {searchTerm ? `"${searchTerm}" için sonuçlar` : 
                 selectedCategory === "all" ? "Tüm Sorular" : 
                 categories.find(c => c.id === selectedCategory)?.name + " Soruları"}
              </h2>
              <span className="text-muted-foreground">
                {filteredFAQ.length} soru bulundu
              </span>
            </div>

            {filteredFAQ.length === 0 ? (
              <Card className="card-cyber text-center p-12">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sonuç bulunamadı</h3>
                <p className="text-muted-foreground mb-6">
                  Aradığınız soruyu bulamadık. Farklı terimler deneyin veya bizimle iletişime geçin.
                </p>
                <Button className="btn-cyber">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  İletişime Geç
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFAQ.map((item) => (
                  <Card key={item.id} className="card-matrix">
                    <Collapsible
                      open={openItems.includes(item.id)}
                      onOpenChange={() => toggleItem(item.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {item.popular && (
                                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                                    Popüler
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {categories.find(c => c.id === item.category)?.name}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg hover:text-accent transition-colors text-left">
                                {item.question}
                              </CardTitle>
                            </div>
                            {openItems.includes(item.id) ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {item.answer}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Yardım Bölümü */}
      <section className="py-16 bg-gradient-cyber text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sorunuz Cevaplandırılamadı mı?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            <span className="font-bold">7/24 ücretsiz destek</span> ekibimiz size yardımcı olmaya hazır!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <MessageCircle className="mr-2 h-5 w-5" />
              Canlı Destek
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <HelpCircle className="mr-2 h-5 w-5" />
              İletişim Formu
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;