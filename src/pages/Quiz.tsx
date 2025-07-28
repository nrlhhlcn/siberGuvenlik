import { useState } from "react";
import { 
  Brain, 
  Trophy, 
  Star, 
  Clock, 
  Users,
  CheckCircle,
  X,
  ArrowRight,
  RotateCcw,
  Download,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const Quiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState<string[]>([]);

  const quizCategories = [
    {
      id: "basics",
      title: "Siber Güvenlik Temelleri",
      description: "Temel siber güvenlik kavramları ve ilkeleri",
      difficulty: "Başlangıç",
      questions: 10,
      timeLimit: "15 dakika",
      participants: 15420,
      rating: 4.8,
      badge: "🛡️",
      color: "text-green-500"
    },
    {
      id: "network",
      title: "Ağ Güvenliği",
      description: "Ağ protokolleri, firewall ve güvenlik önlemleri",
      difficulty: "Orta",
      questions: 15,
      timeLimit: "20 dakika", 
      participants: 8750,
      rating: 4.9,
      badge: "🌐",
      color: "text-amber-500"
    },
    {
      id: "hacking",
      title: "Etik Hacking",
      description: "Penetrasyon testleri ve güvenlik açıkları",
      difficulty: "İleri",
      questions: 20,
      timeLimit: "30 dakika",
      participants: 4200,
      rating: 4.7,
      badge: "👨‍💻",
      color: "text-red-500"
    },
    {
      id: "malware",
      title: "Zararlı Yazılım Analizi",
      description: "Virus, trojan ve malware tespiti",
      difficulty: "İleri",
      questions: 12,
      timeLimit: "18 dakika",
      participants: 3100,
      rating: 4.8,
      badge: "🦠",
      color: "text-red-500"
    }
  ];

  const sampleQuestions = [
    {
      question: "Siber güvenlikte 'CIA Triad' hangi üç temel prensibi ifade eder?",
      options: [
        "Confidentiality, Integrity, Availability",
        "Control, Information, Access",
        "Cybersecurity, Intelligence, Authentication", 
        "Configuration, Integration, Authorization"
      ],
      correct: 0,
      explanation: "CIA Triad, siber güvenliğin temel direği olan Gizlilik (Confidentiality), Bütünlük (Integrity) ve Erişilebilirlik (Availability) prensiplerini temsil eder."
    },
    {
      question: "Hangi saldırı türü kullanıcıları sahte web sitelerine yönlendirerek kişisel bilgilerini çalmaya çalışır?",
      options: [
        "DDoS Saldırısı",
        "Phishing",
        "Man-in-the-Middle",
        "SQL Injection"
      ],
      correct: 1,
      explanation: "Phishing saldırıları, kullanıcıları aldatarak sahte web sitelerine yönlendiren ve kişisel bilgilerini çalmaya çalışan sosyal mühendislik saldırılarıdır."
    },
    {
      question: "Güçlü bir şifre oluştururken hangisi en önemli kuraldır?",
      options: [
        "Sadece büyük harfler kullanmak",
        "En az 8 karakter, büyük-küçük harf, sayı ve özel karakter içermek",
        "Sadece sayılar kullanmak",
        "Kişisel bilgiler içermek"
      ],
      correct: 1,
      explanation: "Güçlü şifreler en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf, sayı ve özel karakterlerin kombinasyonunu içermelidir."
    }
  ];

  const achievements = [
    { title: "İlk Quiz Tamamlandı", description: "İlk siber güvenlik testinizi tamamladınız", icon: "🎯", unlocked: true },
    { title: "Güvenlik Uzmanı", description: "5 farklı kategoride test çözdünüz", icon: "🔒", unlocked: false },
    { title: "Hız Şampiyonu", description: "Bir testi 2 dakikada tamamladınız", icon: "⚡", unlocked: false },
    { title: "Mükemmeliyetçi", description: "Bir testten %100 aldınız", icon: "💯", unlocked: true }
  ];

  const startQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz tamamlandı
        setShowResult(true);
        if (selectedQuiz && !quizCompleted.includes(selectedQuiz)) {
          setQuizCompleted([...quizCompleted, selectedQuiz]);
        }
      }
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === sampleQuestions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Başlangıç": return "bg-green-500/10 text-green-500";
      case "Orta": return "bg-amber-500/10 text-amber-500";
      case "İleri": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Quiz seçim ekranı
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
          </div>
          
          {/* Question Mark Floating Elements */}
          <div className="absolute top-20 left-20 text-4xl text-accent/30 animate-pulse">?</div>
          <div className="absolute bottom-20 right-20 text-3xl text-primary/30 animate-bounce">!</div>
          <div className="absolute top-1/2 right-10 text-2xl text-cyber-blue/30 animate-pulse">✓</div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <Brain className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
              <span className="text-gradient-cyber">Bilgi Yarışması</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
              Siber güvenlik bilginizi test edin ve dijital sertifikanızı kazanın
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm animate-slide-up">
              <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
                <span className="text-accent animate-heartbeat">🏆</span>
                <span>Dijital Sertifika</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
                <span className="text-primary animate-heartbeat">⚡</span>
                <span>Anında Sonuç</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse-glow">
                <span className="text-cyan-400 animate-heartbeat">🎯</span>
                <span>Çoktan Seçmeli</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Kategorileri */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gradient-cyber mb-4">
                Test Kategorileri
              </h2>
              <p className="text-muted-foreground">
                Seviyenize uygun testi seçin ve bilginizi sınayın
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quizCategories.map((quiz, index) => (
                <Card key={quiz.id} className="card-cyber hover-lift group animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-4 animate-float">{quiz.badge}</div>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription>
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-muted-foreground animate-pulse-glow" />
                        <span>{quiz.questions} soru</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground animate-pulse-glow" />
                        <span>{quiz.timeLimit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground animate-pulse-glow" />
                        <span>{quiz.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400 animate-heartbeat" />
                        <span>{quiz.rating}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-accent">
                        Ücretsiz
                      </div>
                      <Button 
                        className="btn-cyber"
                        onClick={() => startQuiz(quiz.id)}
                      >
                        <span>Teste Başla</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Başarılar */}
        <section className="py-16 bg-gradient-cyber text-primary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Başarılarınız
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`text-center ${achievement.unlocked ? 'card-cyber' : 'opacity-50'}`}>
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2 text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && (
                      <Badge className="mt-3 bg-green-500/10 text-green-500">
                        Kazanıldı
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Quiz sonuç ekranı
  if (showResult) {
    const score = calculateScore();
    const correctAnswers = answers.filter((answer, index) => answer === sampleQuestions[index].correct).length;
    
    return (
      <div className="min-h-screen pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="card-cyber text-center">
              <CardHeader>
                <div className="text-6xl mb-4">
                  {score >= 80 ? "🏆" : score >= 60 ? "🥈" : "📚"}
                </div>
                <CardTitle className="text-3xl text-gradient-cyber">
                  {score >= 80 ? "Tebrikler!" : score >= 60 ? "İyi İş!" : "Tekrar Dene!"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {correctAnswers} / {sampleQuestions.length} soruyu doğru yanıtladınız
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">%{score}</div>
                  <Progress value={score} className="h-4 max-w-md mx-auto" />
                </div>

                {score >= 70 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                    <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-500 mb-2">
                      Dijital Sertifika Kazandınız!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Başarınızı kanıtlayan sertifikanızı indirin
                    </p>
                    <Button className="btn-cyber">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Sertifikayı İndir</span>
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="btn-matrix"
                    onClick={() => startQuiz(selectedQuiz!)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    <span>Tekrar Dene</span>
                  </Button>
                  <Button 
                    className="btn-cyber"
                    onClick={resetQuiz}
                  >
                    <span>Diğer Testler</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Detaylı Sonuçlar */}
                <div className="space-y-4 text-left">
                  <h4 className="text-lg font-semibold text-center">Detaylı Sonuçlar</h4>
                  {sampleQuestions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correct;
                    
                    return (
                      <Card key={index} className={`border ${isCorrect ? 'border-green-500/20' : 'border-red-500/20'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium mb-2">{question.question}</p>
                              <p className="text-sm text-muted-foreground mb-2">
                                <strong>Doğru Cevap:</strong> {question.options[question.correct]}
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-red-500 mb-2">
                                  <strong>Sizin Cevabınız:</strong> {question.options[userAnswer]}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                <strong>Açıklama:</strong> {question.explanation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Quiz soru ekranı
  const currentQ = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* İlerleme */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Soru {currentQuestion + 1} / {sampleQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                %{Math.round(progress)} tamamlandı
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Soru */}
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-4 ${
                      selectedAnswer === index ? "btn-cyber" : "btn-matrix"
                    }`}
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="mr-3 font-bold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span>{option}</span>
                  </Button>
                ))}
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  className="btn-matrix"
                  onClick={resetQuiz}
                >
                  Vazgeç
                </Button>
                <Button 
                  className="btn-cyber"
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion === sampleQuestions.length - 1 ? (
                    <>
                      <span>Testi Bitir</span>
                      <Trophy className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Sonraki Soru</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Quiz;