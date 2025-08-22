import { useState } from "react";
import { 
  BookOpen, 
  PlayCircle, 
  Award, 
  Clock, 
  Users,
  Star,
  ChevronRight,
  Download,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const Training = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const courses = [
    {
      id: "cyber-basics",
      title: "Siber Güvenlik Temelleri",
      description: "Siber güvenliğin temel kavramları ve ilkeleri",
      level: "Başlangıç",
      duration: "4 saat",
      students: 12500,
      rating: 4.8,
      progress: 0,
      price: "",
      image: "🛡️",
      topics: ["Güvenlik Temelleri", "Tehdit Türleri", "Risk Değerlendirmesi", "Güvenlik Politikaları"]
    },
    {
      id: "network-security",
      title: "Ağ Güvenliği",
      description: "Ağ altyapısı güvenliği ve koruma teknikleri",
      level: "Orta",
      duration: "6 saat",
      students: 8750,
      rating: 4.9,
      progress: 0,
      price: "",
      image: "🌐",
      topics: ["Firewall Konfigürasyonu", "VPN Kurulumu", "IDS/IPS", "Ağ Monitoring"]
    },
    {
      id: "ethical-hacking",
      title: "Etik Hacking",
      description: "Penetrasyon testleri ve güvenlik açıkları tespiti",
      level: "İleri",
      duration: "12 saat",
      students: 5200,
      rating: 4.9,
      progress: 0,
      price: "",
      image: "👨‍💻",
      topics: ["Penetrasyon Testleri", "Açık Araştırması", "Exploit Geliştirme", "Raporlama"]
    },
    {
      id: "incident-response",
      title: "Olay Müdahale",
      description: "Siber saldırı sonrası müdahale ve iyileştirme",
      level: "İleri",
      duration: "8 saat",
      students: 3100,
      rating: 4.7,
      progress: 0,
      price: "",
      image: "🚨",
      topics: ["Olay Tespiti", "Kanıt Toplama", "Sistem Kurtarma", "Yasal Süreçler"]
    }
  ];

  const certifications = [
    {
      title: "Siber Güvenlik Uzmanı",
      description: "Kapsamlı siber güvenlik bilgisi sertifikası",
      courses: 4,
      duration: "3 ay",
      price: ""
    },
    {
      title: "Etik Hacker Sertifikası",
      description: "Penetrasyon testleri ve güvenlik analizi",
      courses: 6,
      duration: "6 ay",
      price: ""
    },
    {
      title: "Ağ Güvenliği Uzmanı",
      description: "Ağ altyapısı güvenliği ve yönetimi",
      courses: 5,
      duration: "4 ay",
      price: ""
    }
  ];

  const enrollCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Başlangıç": return "bg-green-500/10 text-green-500";
      case "Orta": return "bg-amber-500/10 text-amber-500";
      case "İleri": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 right-20 w-24 h-24 bg-accent/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-cyber-blue/30 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <BookOpen className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
            <span className="text-gradient-cyber">Eğitim Merkezi</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto animate-fade-in">
            Siber güvenlik uzmanı olmak için gereken tüm bilgileri öğrenin. Başlangıçtan ileri seviyeye eğitimler.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12 animate-slide-up">
            <div className="text-center animate-heartbeat">
              <div className="text-3xl font-bold text-accent">50+</div>
              <div className="text-sm text-muted-foreground">Kurs</div>
            </div>
            <div className="text-center animate-heartbeat" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Kaliteli İçerik</div>
            </div>
            <div className="text-center animate-heartbeat" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-cyan-400">∞</div>
              <div className="text-sm text-muted-foreground">Sınırsız Erişim</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ana İçerik */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="courses" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Kurslar</TabsTrigger>
              <TabsTrigger value="certifications">Sertifikalar</TabsTrigger>
              <TabsTrigger value="progress">İlerleme</TabsTrigger>
            </TabsList>

            {/* Kurslar */}
            <TabsContent value="courses">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map((course, index) => (
                  <Card key={course.id} className="card-cyber hover-lift group animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-4xl mb-4 animate-float">{course.image}</div>
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-accent transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription>
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 animate-pulse-glow" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 animate-pulse-glow" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400 animate-heartbeat" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Konu Başlıkları:</h4>
                        <div className="flex flex-wrap gap-1">
                          {course.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="text-2xl font-bold text-accent">
                          
                        </div>
                        <Button 
                          className="btn-cyber"
                          onClick={() => enrollCourse(course.id)}
                          disabled={enrolledCourses.includes(course.id)}
                        >
                          {enrolledCourses.includes(course.id) ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Kayıtlı</span>
                            </>
                          ) : (
                            <>
                              <span>Kursa Katıl</span>
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sertifikalar */}
            <TabsContent value="certifications">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gradient-cyber mb-4">
                    Profesyonel Sertifika Programları
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Endüstri standardında sertifikalar alın ve kariyerinizde fark yaratın.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {certifications.map((cert, index) => (
                    <Card key={index} className="card-matrix hover-lift">
                      <CardHeader>
                        <Award className="h-12 w-12 text-accent mb-4" />
                        <CardTitle className="text-xl">
                          {cert.title}
                        </CardTitle>
                        <CardDescription>
                          {cert.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kurs Sayısı:</span>
                            <span className="font-medium">{cert.courses} kurs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Süre:</span>
                            <span className="font-medium">{cert.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fiyat:</span>
                            <span className="font-bold text-accent"></span>
                          </div>
                        </div>
                        <Button className="btn-cyber w-full">
                          <span>Programa Katıl</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* İlerleme */}
            <TabsContent value="progress">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gradient-cyber mb-4">
                    Öğrenme İlerlemeniz
                  </h2>
                  <p className="text-muted-foreground">
                    Kayıtlı olduğunuz kurslar ve başarılarınız
                  </p>
                </div>

                {enrolledCourses.length > 0 ? (
                  <div className="space-y-6">
                    {enrolledCourses.map((courseId) => {
                      const course = courses.find(c => c.id === courseId);
                      if (!course) return null;

                      return (
                        <Card key={courseId} className="card-cyber">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-2xl">{course.image}</div>
                                <div>
                                  <CardTitle className="text-lg">{course.title}</CardTitle>
                                  <CardDescription>{course.description}</CardDescription>
                                </div>
                              </div>
                              <Badge className={getLevelColor(course.level)}>
                                {course.level}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>İlerleme</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            <div className="flex space-x-2">
                              <Button className="btn-cyber flex-1">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                <span>Devam Et</span>
                              </Button>
                              <Button variant="outline" className="btn-matrix">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="card-cyber text-center p-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Henüz kayıtlı olduğunuz kurs yok</h3>
                    <p className="text-muted-foreground mb-6">
                      Öğrenme yolculuğunuza başlamak için bir kursa katılın
                    </p>
                    <Button className="btn-cyber">
                      <span>Kursları İncele</span>
                    </Button>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Training;