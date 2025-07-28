import { useState } from "react";
import { 
  Search, 
  Key, 
  Hash, 
  Wifi, 
  Shield, 
  Eye,
  Download,
  Copy,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const Tools = () => {
  const [ipResult, setIpResult] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: "ip-lookup",
      title: "IP Sorgulama",
      description: "IP adresinin konum ve ISP bilgilerini öğrenin",
      icon: Search,
      color: "text-primary"
    },
    {
      id: "password-generator",
      title: "Güvenli Şifre Oluşturucu",
      description: "Karmaşık ve güvenli şifreler oluşturun",
      icon: Key,
      color: "text-accent"
    },
    {
      id: "hash-generator",
      title: "Hash Oluşturucu",
      description: "MD5, SHA-256 ve diğer hash algoritmalarını kullanın",
      icon: Hash,
      color: "text-destructive"
    },
    {
      id: "port-scanner",
      title: "Port Tarayıcı",
      description: "Ağ güvenliği için port tarama işlemleri",
      icon: Wifi,
      color: "text-cyan-400"
    }
  ];

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-accent/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-cyber-blue/20 rounded-full animate-bounce"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Shield className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
            <span className="text-gradient-cyber">Güvenlik Araçları</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Profesyonel siber güvenlik araçlarını kullanın. IP analizi, hash oluşturma ve daha fazlası.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm text-accent animate-slide-up">
            <Badge variant="secondary" className="bg-primary/20 text-primary animate-pulse-glow">Hızlı</Badge>
            <Badge variant="secondary" className="bg-cyber-blue/20 text-cyan-400 animate-pulse-glow">Güvenli</Badge>
            <Badge variant="secondary" className="bg-accent/20 text-accent animate-pulse-glow">Profesyonel</Badge>
          </div>
        </div>
      </section>

      {/* Araçlar Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.id} className="card-cyber hover-lift group animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Icon className={`h-12 w-12 ${tool.color} group-hover:animate-cyber-pulse animate-rotate-in`} />
                      <div>
                        <CardTitle className="text-xl group-hover:text-accent transition-colors">
                          {tool.title}
                        </CardTitle>
                        <CardDescription>
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Araç Detayları */}
          <Tabs defaultValue="ip-lookup" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {tools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="text-xs md:text-sm">
                  {tool.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* IP Sorgulama */}
            <TabsContent value="ip-lookup">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-6 w-6 text-primary" />
                    <span>IP Adresi Sorgulama</span>
                  </CardTitle>
                  <CardDescription>
                    Bir IP adresinin coğrafi konumu, ISP bilgileri ve güvenlik durumunu kontrol edin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip-input">IP Adresi</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="ip-input"
                        placeholder="Örn: 8.8.8.8"
                        className="flex-1"
                      />
                      <Button className="btn-cyber">
                        <span>Sorgula</span>
                      </Button>
                    </div>
                  </div>
                  
                  {ipResult && (
                    <div className="bg-muted/50 p-4 rounded-lg animate-fade-in">
                      <h4 className="font-semibold text-accent mb-2">Sonuç:</h4>
                      <pre className="text-sm text-muted-foreground">{ipResult}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Şifre Oluşturucu */}
            <TabsContent value="password-generator">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-6 w-6 text-accent" />
                    <span>Güvenli Şifre Oluşturucu</span>
                  </CardTitle>
                  <CardDescription>
                    Karmaşık ve güvenli şifreler oluşturun. Özel karakterler, sayılar ve harfler içerir.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Button onClick={generatePassword} className="btn-cyber">
                      <span>Şifre Oluştur</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="btn-matrix"
                      onClick={() => copyToClipboard(password)}
                      disabled={!password}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {password && (
                    <div className="bg-muted/50 p-4 rounded-lg animate-fade-in">
                      <Label className="text-accent font-semibold">Oluşturulan Şifre:</Label>
                      <div className="mt-2 p-3 bg-card rounded border font-mono text-lg break-all">
                        {password}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Güçlü şifre: ✓ Büyük harf, ✓ Küçük harf, ✓ Sayı, ✓ Özel karakter
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hash Oluşturucu */}
            <TabsContent value="hash-generator">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-6 w-6 text-destructive" />
                    <span>Hash Oluşturucu</span>
                  </CardTitle>
                  <CardDescription>
                    Metinlerinizin MD5, SHA-1, SHA-256 hash değerlerini oluşturun.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hash-input">Metin</Label>
                    <Textarea
                      id="hash-input"
                      placeholder="Hash'ini almak istediğiniz metni buraya yazın..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="btn-cyber">
                      <span>MD5</span>
                    </Button>
                    <Button variant="outline" className="btn-matrix">
                      SHA-1
                    </Button>
                    <Button variant="outline" className="btn-matrix">
                      SHA-256
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Port Tarayıcı */}
            <TabsContent value="port-scanner">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wifi className="h-6 w-6 text-cyan-400" />
                    <span>Port Tarayıcı</span>
                  </CardTitle>
                  <CardDescription>
                    Hedef IP adresinde açık portları tespit edin ve ağ güvenliğini analiz edin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-ip">Hedef IP</Label>
                      <Input
                        id="target-ip"
                        placeholder="192.168.1.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port-range">Port Aralığı</Label>
                      <Input
                        id="port-range"
                        placeholder="1-1000"
                      />
                    </div>
                  </div>
                  
                  <Button className="btn-cyber w-full">
                    <span>Taramayı Başlat</span>
                  </Button>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Uyarı:</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Port tarama işlemini sadece kendi ağınızda veya izniniz olan sistemlerde yapın.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Güvenlik Uyarısı */}
      <section className="py-12 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-destructive mb-4">
            Güvenlik ve Yasal Uyarı
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Bu araçlar eğitim ve güvenlik testi amaçlı hazırlanmıştır. 
            Sadece size ait olan veya test etme izniniz bulunan sistemlerde kullanın. 
            Yetkisiz erişim ve test etme yasal sonuçlar doğurabilir.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Tools;