import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle,
  Users,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import { DiscussionForm } from "@/components/DiscussionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: "E-posta",
      description: "Sorularınız için bize yazın",
      contact: "info@cyberguard.com",
      responseTime: "24 saat içinde"
    },
    {
      icon: MessageCircle,
      title: "Canlı Destek",
      description: "Anında yardım alın",
      contact: "7/24 Destek",
      responseTime: "Hemen"
    },
    {
      icon: Phone,
      title: "Telefon",
      description: "Acil durumlar için arayın",
      contact: "+90 (212) 555-0123",
      responseTime: "Çalışma saatleri"
    }
  ];

  const faqItems = [
    {
      question: "Tüm araçlar gerçekten ücretsiz mi?",
      answer: "Evet! Platformumuzdaki tüm araçlar, eğitimler ve içerikler tamamen ücretsizdir. Hiçbir ücret talep etmiyoruz."
    },
    {
      question: "Sertifikalar nasıl alınır?",
      answer: "Quiz testlerini başarıyla tamamladığınızda otomatik olarak dijital sertifikanızı alabilirsiniz. Tümü ücretsiz!"
    },
    {
      question: "Araçları ticari amaçla kullanabilir miyim?",
      answer: "Eğitim ve kişisel kullanım için tüm araçlarımızı kullanabilirsiniz. Ticari kullanım için lütfen bizimle iletişime geçin."
    },
    {
      question: "Yeni özellikler ne zaman eklenir?",
      answer: "Platformumuzu sürekli geliştiriyoruz. Yeni araçlar ve eğitimler düzenli olarak eklenir."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemi
    setIsSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Card className="card-cyber max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gradient-cyber mb-4">
              Mesajınız Gönderildi!
            </h2>
            <p className="text-muted-foreground mb-6">
              Mesajınız için teşekkürler. En kısa sürede size geri dönüş yapacağız.
            </p>
            <Button 
              className="btn-cyber"
              onClick={() => setIsSubmitted(false)}
            >
              Yeni Mesaj Gönder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-accent/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-cyber-blue/20 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <MessageCircle className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
            <span className="text-gradient-cyber">Bizimle İletişime Geçin</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Sorularınız, önerileriniz veya geri bildirimleriniz için buradan bize ulaşabilirsiniz. 
            <span className="text-accent font-semibold"> Destek tamamen ücretsiz!</span>
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm animate-slide-up">
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-accent animate-heartbeat">💬</span>
              <span>7/24 Destek</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-primary animate-heartbeat">⚡</span>
              <span>Hızlı Yanıt</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-cyan-400 animate-heartbeat">🆓</span>
              <span>Ücretsiz</span>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim Yöntemleri */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="card-cyber hover-lift text-center">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-accent mx-auto mb-4" />
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold text-accent mb-2">
                      {method.contact}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {method.responseTime}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* İletişim Formu ve SSS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* İletişim Formu */}
            <Card className="card-matrix">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient-cyber">
                  Mesaj Gönderin
                </CardTitle>
                <CardDescription>
                  Formu doldurun, size en kısa sürede geri dönelim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Adınızı girin"
                        className="relative z-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@ornegi.com"
                        className="relative z-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Konu Kategorisi</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full p-2 border rounded-md bg-background relative z-10"
                    >
                      <option value="general">Genel Sorular</option>
                      <option value="technical">Teknik Destek</option>
                      <option value="feature">Özellik Önerisi</option>
                      <option value="bug">Hata Bildirimi</option>
                      <option value="partnership">İş Birliği</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Mesajınızın konusu"
                      className="relative z-10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesaj</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Mesajınızı buraya yazın..."
                      className="min-h-[120px] relative z-10"
                      required
                    />
                  </div>

                  <Button type="submit" className="btn-cyber w-full">
                    <Send className="mr-2 h-4 w-4" />
                    <span>Mesajı Gönder</span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* SSS */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gradient-cyber mb-4">
                  Sıkça Sorulan Sorular
                </h2>
                <p className="text-muted-foreground">
                  En çok merak edilen konular ve cevapları
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <Card key={index} className="card-cyber">
                    <CardHeader>
                      <CardTitle className="text-lg text-accent">
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* İstatistikler */}
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="text-xl">Destek İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">&lt; 2 saat</div>
                      <div className="text-sm text-muted-foreground">Ortalama Yanıt</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">98%</div>
                      <div className="text-sm text-muted-foreground">Memnuniyet</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-muted-foreground">Destek</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">100%</div>
                      <div className="text-sm text-muted-foreground">Ücretsiz</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Konum Bilgisi */}
      <section className="py-16 bg-gradient-cyber text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Bizim Hakkımızda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Güvenilir</h3>
              <p className="opacity-90">
                Siber güvenlik alanında uzman ekibimizle güvenilir hizmet
              </p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Topluluk</h3>
              <p className="opacity-90">
                50.000+ kullanıcıdan oluşan büyük bir topluluk
              </p>
            </div>
            <div>
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">İstanbul</h3>
              <p className="opacity-90">
                Türkiye'nin siber güvenlik merkezinden hizmet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tartışma Formu */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-cyber mb-4">
              Topluluk Tartışmaları
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Siber güvenlik konularında sorularınızı sorun, deneyimlerinizi paylaşın ve 
              uzmanlardan yardım alın.
            </p>
          </div>
          <DiscussionForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;