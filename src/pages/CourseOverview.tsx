import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { courseContents } from "@/data/courseContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Clock, BookOpen, Star, PlayCircle, ArrowRight } from "lucide-react";

const CourseOverview = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = useMemo(() => courseContents.find(c => c.id === courseId), [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kurs bulunamadı</h1>
          <Button onClick={() => navigate('/training')}>Eğitim Merkezine Dön</Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-background to-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/training">Eğitim</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{course.duration}</div>
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{course.modules.length} modül • {totalLessons} ders</div>
                <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />4.8</div>
              </div>
              <div className="mt-6">
                <Button size="lg" className="btn-cyber" onClick={() => navigate(`/course/${course.id}/module/0/lesson/0`)}>
                  <PlayCircle className="h-5 w-5 mr-2" />Başla
                </Button>
              </div>
            </div>
            <div>
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle>Kurs Bilgileri</CardTitle>
                  <CardDescription>Düzey ve süre</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <div className="text-sm text-muted-foreground">Süre: {course.duration}</div>
                  <div className="text-sm text-muted-foreground">Modül: {course.modules.length}</div>
                  <div className="text-sm text-muted-foreground">Ders: {totalLessons}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Modüller</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {course.modules.map((m, idx) => (
            <Card key={m.id} className="hover-lift transition-transform">
              <CardHeader>
                <CardTitle className="text-lg">{m.title}</CardTitle>
                <CardDescription>{m.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{m.duration} • {m.lessons.length} ders</span>
                  <Button size="sm" onClick={() => navigate(`/course/${course.id}/module/${idx}/lesson/0`)}>
                    İncele <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;


