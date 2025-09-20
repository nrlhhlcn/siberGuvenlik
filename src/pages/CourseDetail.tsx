import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Download,
  Star,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { courseContents } from "@/data/courseContent";

const CourseDetail = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams<{ courseId: string, moduleIndex?: string, lessonIndex?: string }>();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(Number(moduleIndex ?? 0));
  const [currentLesson, setCurrentLesson] = useState(Number(lessonIndex ?? 0));
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Kurs içeriğini bul
  const course = courseContents.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kurs bulunamadı</h1>
          <Button onClick={() => navigate('/training')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Eğitim Merkezine Dön
          </Button>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData?.lessons[currentLesson];

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'text': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <Award className="h-4 w-4" />;
      case 'practice': return <Download className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
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
      {/* Modern Hero + Breadcrumb */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-background" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative border-b">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/training">Eğitim</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/course/${course.id}/overview`}>Kurs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{course.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
                  {course.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                  {course.description}
                </p>
                <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{course.duration}</div>
                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{course.modules.length} Modül</div>
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />4.8</div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle>İlerleme</CardTitle>
                    <CardDescription>
                      {completedLessons.length}/{course.modules.reduce((t, m) => t + m.lessons.length, 0)} tamamlandı
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={(completedLessons.length / course.modules.reduce((t, m) => t + m.lessons.length, 0)) * 100} className="h-2" />
                    <Button className="btn-cyber w-full" onClick={() => navigate(`/course/${course.id}/overview`)}>
                      <PlayCircle className="mr-2 h-4 w-4" />Kursa Genel Bakış
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-8">
            {currentLessonData ? (
              <Card className="card-cyber">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {currentLessonData.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {currentModuleData.title} • {currentLessonData.duration}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {currentLessonData.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <ScrollArea className="h-[calc(100vh-320px)] pr-2">
                      <div className="prose prose-gray max-w-none">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: currentLessonData.content.replace(/\n/g, '<br>') 
                          }} 
                        />
                      </div>
                      <div className="mt-6">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="highlights">
                            <AccordionTrigger>Önemli Noktalar</AccordionTrigger>
                            <AccordionContent>
                              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                                <CardContent className="pt-4">
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      <span>Güvenlik sürekli bir süreçtir</span>
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      <span>Herkesin sorumluluğudur</span>
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      <span>Temel prensipleri anlamak önemli</span>
                                    </li>
                                  </ul>
                                </CardContent>
                              </Card>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="quiz">
                            <AccordionTrigger>Hızlı Test</AccordionTrigger>
                            <AccordionContent>
                              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                                <CardContent className="pt-4">
                                  <div className="space-y-3">
                                    <p className="text-sm font-medium">CIA Triad'ın üç temel prensibi nedir?</p>
                                    <div className="space-y-2">
                                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                                        A) Gizlilik, Bütünlük, Erişilebilirlik
                                      </Button>
                                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                                        B) Güvenlik, Koruma, Savunma
                                      </Button>
                                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                                        C) Şifreleme, Kimlik, Yetkilendirme
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="examples">
                            <AccordionTrigger>Pratik Örnekler</AccordionTrigger>
                            <AccordionContent>
                              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                                <CardContent className="pt-4">
                                  <div className="space-y-4">
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                      <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-2">
                                        💡 Gizlilik Örneği
                                      </h4>
                                      <p className="text-sm">
                                        E-posta şifreleme ile hassas bilgilerin sadece yetkili kişiler tarafından okunması sağlanır.
                                      </p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                      <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-2">
                                        🔒 Bütünlük Örneği
                                      </h4>
                                      <p className="text-sm">
                                        Hash kontrolü ile dosyaların değiştirilmediğini doğrulayabilirsiniz.
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="resources">
                            <AccordionTrigger>Ek Kaynaklar</AccordionTrigger>
                            <AccordionContent>
                              <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                                <CardContent className="pt-4">
                                  <div className="space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                      📄 Güvenlik Politikası Şablonu
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                      📊 Risk Değerlendirme Matrisi
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                      🎯 Tehdit Analizi Rehberi
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </ScrollArea>
                  </div>
                  
                  {/* Bottom sticky nav */}
                  <div className="sticky bottom-4">
                    <div className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-3 flex items-center justify-between shadow-sm">
                      <Button variant="outline" disabled={currentLesson === 0}
                        onClick={() => {
                          const prev = Math.max(0, currentLesson - 1);
                          setCurrentLesson(prev);
                          navigate(`/course/${course.id}/module/${currentModule}/lesson/${prev}`);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />Önceki
                      </Button>
                      <div className="text-xs text-muted-foreground">{currentLesson + 1} / {currentModuleData.lessons.length}</div>
                      {currentLesson < currentModuleData.lessons.length - 1 ? (
                        <Button className="btn-cyber" onClick={() => {
                          const next = currentLesson + 1;
                          setCurrentLesson(next);
                          navigate(`/course/${course.id}/module/${currentModule}/lesson/${next}`);
                        }}>
                          Sonraki<ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button className="btn-cyber" onClick={() => handleLessonComplete(currentLessonData.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />Tamamla
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-cyber text-center p-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ders seçin</h3>
                <p className="text-muted-foreground">
                  Sol taraftan bir modül ve ders seçerek eğitime başlayın
                </p>
              </Card>
            )}
          </div>

          {/* Right Progress Rail */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle>Modüller</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, mIndex) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger onClick={() => {
                        setCurrentModule(mIndex);
                        setCurrentLesson(0);
                        navigate(`/course/${course.id}/module/${mIndex}/lesson/0`);
                      }}>
                        <div className="text-left">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs text-muted-foreground">{module.lessons.length} ders • {module.duration}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {module.lessons.map((lesson, lIndex) => (
                            <button
                              key={lesson.id}
                              className={`w-full text-left p-2 rounded flex items-center gap-2 transition-colors ${currentModule === mIndex && currentLesson === lIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                              onClick={() => {
                                setCurrentModule(mIndex);
                                setCurrentLesson(lIndex);
                                navigate(`/course/${course.id}/module/${mIndex}/lesson/${lIndex}`);
                              }}
                            >
                              {completedLessons.includes(lesson.id) ? <CheckCircle className="h-4 w-4 text-green-500" /> : getLessonIcon(lesson.type)}
                              <span className="text-sm">{lesson.title}</span>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
