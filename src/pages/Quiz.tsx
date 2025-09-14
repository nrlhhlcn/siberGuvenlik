import React, { useState, useEffect } from "react";
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
  Award,
  Puzzle,
  Target,
  Zap,
  Gamepad2,
  BookOpen,
  Lightbulb,
  Shield,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const Quiz = () => {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState<string[]>([]);
  
  // Oyun durumları
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Oyun türleri
  const gameTypes = [
    {
      id: "quiz",
      title: "Soru-Cevap Quiz",
      description: "Klasik çoktan seçmeli sorular",
      icon: Brain,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "matching",
      title: "Eşleştirme Oyunu",
      description: "Kavramları doğru şekilde eşleştirin",
      icon: Target,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "puzzle",
      title: "Yapboz Oyunu",
      description: "Parçaları birleştirerek resmi tamamlayın",
      icon: Puzzle,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "wordsearch",
      title: "Kelime Bulmaca",
      description: "Siber güvenlik terimlerini bulun",
      icon: BookOpen,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: "memory",
      title: "Hafıza Oyunu",
      description: "Kartları eşleştirerek hafızanızı test edin",
      icon: Zap,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: "scenario",
      title: "Senaryo Oyunu",
      description: "Gerçek hayat durumlarını çözün",
      icon: Lightbulb,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

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
    setSelectedGameType(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setGameScore(0);
    setGameTime(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  // Oyun başlatma fonksiyonu
  const startGame = (gameType: string) => {
    setSelectedGameType(gameType);
    setGameStarted(true);
    setGameScore(0);
    setGameTime(0);
    setGameCompleted(false);
  };

  // Quiz oyunu component'i
  const QuizGame = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedAns, setSelectedAns] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [showResult, setShowResult] = useState(false);

    const quizQuestions = [
      {
        question: "Siber güvenlikte 'Phishing' nedir?",
        options: [
          "Bilgisayar virüsü",
          "Sahte e-posta ile kişisel bilgi çalma",
          "Ağ güvenlik duvarı",
          "Şifreleme yöntemi"
        ],
        correct: 1
      },
      {
        question: "Hangi şifre en güvenlidir?",
        options: [
          "123456",
          "password",
          "MyP@ssw0rd2024!",
          "admin"
        ],
        correct: 2
      },
      {
        question: "İki faktörlü kimlik doğrulama (2FA) nedir?",
        options: [
          "İki farklı şifre kullanma",
          "SMS + şifre ile giriş",
          "İki farklı cihaz kullanma",
          "Çift güvenlik duvarı"
        ],
        correct: 1
      },
      {
        question: "Ransomware nedir?",
        options: [
          "Antivirus yazılımı",
          "Fidye yazılımı",
          "Güvenlik duvarı",
          "Şifreleme aracı"
        ],
        correct: 1
      },
      {
        question: "VPN'in temel amacı nedir?",
        options: [
          "İnternet hızını artırmak",
          "Güvenli bağlantı sağlamak",
          "Dosya paylaşımı",
          "E-posta göndermek"
        ],
        correct: 1
      }
    ];

    const handleAnswer = (answerIndex: number) => {
      setSelectedAns(answerIndex);
    };

    const nextQuestion = () => {
      if (selectedAns !== null) {
        const newAnswers = [...userAnswers, selectedAns];
        setUserAnswers(newAnswers);
        
        if (currentQ < quizQuestions.length - 1) {
          setCurrentQ(currentQ + 1);
          setSelectedAns(null);
        } else {
          setShowResult(true);
        }
      }
    };

    const calculateScore = () => {
      let correct = 0;
      userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
          correct++;
        }
      });
      return Math.round((correct / quizQuestions.length) * 100);
    };

    if (showResult) {
      const score = calculateScore();
      return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            <Card className="card-matrix max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">
                  {score >= 80 ? "🏆" : score >= 60 ? "🥈" : "🥉"}
                </div>
                <h2 className="text-3xl font-bold mb-4">Quiz Tamamlandı!</h2>
                <div className="text-4xl font-bold text-primary mb-4">%{score}</div>
                <p className="text-muted-foreground mb-6">
                  {score >= 80 ? "Harika! Siber güvenlik konusunda çok iyisin!" :
                   score >= 60 ? "İyi iş! Biraz daha çalışarak mükemmel olabilirsin." :
                   "Tekrar deneyin! Herkes öğrenmeye başlar."}
                </p>
                <div className="space-y-2">
                  <Button onClick={() => setShowResult(false)} className="mr-4">
                    Tekrar Oyna
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGameType(null)}>
                    Ana Menüye Dön
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">🧠 Siber Güvenlik Quiz</h1>
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline">Soru {currentQ + 1} / {quizQuestions.length}</Badge>
                <Badge className="bg-primary">Puan: {gameScore}</Badge>
              </div>
              <Progress value={(currentQ / quizQuestions.length) * 100} className="mb-6" />
            </div>

            <Card className="card-matrix">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-6">
                  {quizQuestions[currentQ].question}
                </h2>
                
                <div className="space-y-3">
                  {quizQuestions[currentQ].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAns === index ? "default" : "outline"}
                      className={`w-full justify-start text-left h-auto p-4 ${
                        selectedAns === index ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => handleAnswer(index)}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button 
                    onClick={nextQuestion}
                    disabled={selectedAns === null}
                    className="btn-cyber"
                  >
                    {currentQ === quizQuestions.length - 1 ? "Sonuçları Gör" : "Sonraki Soru"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Eşleştirme oyunu component'i
  const MatchingGame = () => {
    const [leftItems, setLeftItems] = useState<string[]>([]);
    const [rightItems, setRightItems] = useState<string[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [selectedRight, setSelectedRight] = useState<number | null>(null);
    const [matches, setMatches] = useState<{[key: number]: number}>({});
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const matchingPairs = [
      { left: "Phishing", right: "Sahte e-posta ile bilgi çalma" },
      { left: "Ransomware", right: "Fidye yazılımı" },
      { left: "Firewall", right: "Güvenlik duvarı" },
      { left: "VPN", right: "Sanal özel ağ" },
      { left: "2FA", right: "İki faktörlü kimlik doğrulama" },
      { left: "Malware", right: "Zararlı yazılım" }
    ];

    // Oyunu başlat
    const startGame = () => {
      const shuffledLeft = [...matchingPairs.map(p => p.left)].sort(() => Math.random() - 0.5);
      const shuffledRight = [...matchingPairs.map(p => p.right)].sort(() => Math.random() - 0.5);
      setLeftItems(shuffledLeft);
      setRightItems(shuffledRight);
      setMatches({});
      setScore(0);
      setGameCompleted(false);
    };

    // Sol taraftan seçim
    const selectLeft = (index: number) => {
      if (selectedLeft === null) {
        setSelectedLeft(index);
      } else if (selectedLeft === index) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(index);
      }
    };

    // Sağ taraftan seçim
    const selectRight = (index: number) => {
      if (selectedRight === null) {
        setSelectedRight(index);
      } else if (selectedRight === index) {
        setSelectedRight(null);
      } else {
        setSelectedRight(index);
      }
    };

    // Eşleştirme kontrolü
    const checkMatch = () => {
      if (selectedLeft !== null && selectedRight !== null) {
        const leftItem = leftItems[selectedLeft];
        const rightItem = rightItems[selectedRight];
        
        // Doğru eşleştirme var mı kontrol et
        const isCorrect = matchingPairs.some(pair => 
          pair.left === leftItem && pair.right === rightItem
        );

        if (isCorrect) {
          setMatches(prev => ({ ...prev, [selectedLeft]: selectedRight }));
          setScore(prev => prev + 10);
          
          // Tüm eşleştirmeler tamamlandı mı?
          if (Object.keys(matches).length + 1 === matchingPairs.length) {
            setGameCompleted(true);
          }
        } else {
          // Yanlış eşleştirme - puan düş
          setScore(prev => Math.max(0, prev - 5));
        }
        
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    };

    // Oyun başlatılmamışsa başlat
    if (leftItems.length === 0) {
      startGame();
    }

    if (gameCompleted) {
      return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            <Card className="card-matrix max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold mb-4">Eşleştirme Tamamlandı!</h2>
                <div className="text-4xl font-bold text-primary mb-4">{score} Puan</div>
                <p className="text-muted-foreground mb-6">
                  Harika! Tüm kavramları doğru eşleştirdiniz!
                </p>
                <div className="space-y-2">
                  <Button onClick={startGame} className="mr-4">
                    Tekrar Oyna
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGameType(null)}>
                    Ana Menüye Dön
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">🎯 Eşleştirme Oyunu</h1>
              <div className="flex justify-center items-center gap-4 mb-6">
                <Badge variant="outline">Puan: {score}</Badge>
                <Badge className="bg-primary">
                  Eşleştirme: {Object.keys(matches).length} / {matchingPairs.length}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sol taraf - Kavramlar */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Kavramlar</h3>
                <div className="space-y-3">
                  {leftItems.map((item, index) => (
                    <Button
                      key={index}
                      variant={matches[index] !== undefined ? "default" : "outline"}
                      className={`w-full justify-start h-auto p-4 ${
                        selectedLeft === index ? "bg-primary text-primary-foreground" : ""
                      } ${matches[index] !== undefined ? "opacity-50" : ""}`}
                      onClick={() => !matches[index] && selectLeft(index)}
                      disabled={matches[index] !== undefined}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sağ taraf - Açıklamalar */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Açıklamalar</h3>
                <div className="space-y-3">
                  {rightItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start h-auto p-4 ${
                        selectedRight === index ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => selectRight(index)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                onClick={checkMatch}
                disabled={selectedLeft === null || selectedRight === null}
                className="btn-cyber"
              >
                Eşleştir
                <Target className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Yapboz parça şekillerini belirleyen fonksiyon
  const getPuzzleClipPath = (row: number, col: number) => {
    const positions = [
      // Sol üst köşe
      'polygon(0% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 100%, 0% 100%)',
      // Üst orta
      'polygon(15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%, 0% 15%, 15% 15%)',
      // Sağ üst köşe
      'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 15%, 15% 15%)',
      // Sol orta
      'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)',
      // Merkez
      'polygon(15% 15%, 85% 15%, 85% 0%, 100% 0%, 100% 15%, 100% 85%, 100% 100%, 85% 100%, 85% 85%, 15% 85%, 15% 100%, 0% 100%, 0% 85%, 0% 15%, 0% 0%, 15% 0%)',
      // Sağ orta
      'polygon(0% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 0% 100%, 0% 85%, 15% 85%, 15% 15%, 0% 15%)',
      // Sol alt köşe
      'polygon(0% 0%, 85% 0%, 85% 85%, 100% 85%, 100% 100%, 0% 100%)',
      // Alt orta
      'polygon(0% 0%, 15% 0%, 15% 15%, 0% 15%, 0% 85%, 15% 85%, 15% 100%, 85% 100%, 85% 85%, 100% 85%, 100% 15%, 85% 15%, 85% 0%, 100% 0%)',
      // Sağ alt köşe
      'polygon(0% 0%, 100% 0%, 100% 85%, 15% 85%, 15% 100%, 0% 100%)'
    ];
    
    return positions[row * 3 + col];
  };

  // Yapboz oyunu component'i
  const PuzzleGame = () => {
    const [puzzlePieces, setPuzzlePieces] = useState<{id: number, content: string, isPlaced: boolean, correctPosition: number, x: number, y: number}[]>([]);
    const [puzzleSlots, setPuzzleSlots] = useState<{id: number, question: string, answer: string, isFilled: boolean, placedPiece: number | null, x: number, y: number}[]>([]);
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 dakika
    const [showFinalImage, setShowFinalImage] = useState(false);

    const puzzleData = [
      { question: "Ağ trafiğini kontrol eden güvenlik sistemi?", answer: "Firewall", emoji: "🛡️" },
      { question: "Verileri korumak için kullanılan yöntem?", answer: "Şifreleme", emoji: "🔒" },
      { question: "İki faktörlü kimlik doğrulama kısaltması?", answer: "2FA", emoji: "⚡" },
      { question: "Güvenlik açıklarını tespit etme işlemi?", answer: "Vulnerability Scan", emoji: "🔍" },
      { question: "Siber saldırıları test etme yöntemi?", answer: "Penetration Test", emoji: "🎯" },
      { question: "Güvenlik olaylarına müdahale süreci?", answer: "Incident Response", emoji: "🚨" },
      { question: "Risk değerlendirme süreci?", answer: "Risk Assessment", emoji: "📊" },
      { question: "Güvenlik ekibi?", answer: "Security Team", emoji: "👥" },
      { question: "Mobil cihaz güvenliği?", answer: "Mobile Security", emoji: "📱" }
    ];

    // Oyunu başlat
    const startGame = () => {
      const shuffledAnswers = [...puzzleData.map(item => item.answer)].sort(() => Math.random() - 0.5);
      
      // Parçaları rastgele pozisyonlara yerleştir
      const pieces = shuffledAnswers.map((answer, index) => ({
        id: index,
        content: answer,
        isPlaced: false,
        correctPosition: puzzleData.findIndex(item => item.answer === answer),
        x: Math.random() * 300 + 50, // Rastgele x pozisyonu
        y: Math.random() * 200 + 50  // Rastgele y pozisyonu
      }));

      // Yapboz tahtası pozisyonları (3x3 grid)
      const slots = puzzleData.map((item, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return {
          id: index,
          question: item.question,
          answer: item.answer,
          isFilled: false,
          placedPiece: null,
          x: col * 100 + 50, // Grid x pozisyonu
          y: row * 100 + 50  // Grid y pozisyonu
        };
      });

      setPuzzlePieces(pieces);
      setPuzzleSlots(slots);
      setScore(0);
      setGameCompleted(false);
      setTimeLeft(120);
      setShowFinalImage(false);
    };

    // Drag başlat
    const handleDragStart = (e: React.DragEvent, pieceId: number) => {
      setDraggedPiece(pieceId);
      e.dataTransfer.effectAllowed = 'move';
    };

    // Drag bitir
    const handleDragEnd = () => {
      setDraggedPiece(null);
    };

    // Drop işlemi
    const handleDrop = (e: React.DragEvent, slotId: number) => {
      e.preventDefault();
      
      if (draggedPiece === null) return;

      const piece = puzzlePieces.find(p => p.id === draggedPiece);
      const slot = puzzleSlots.find(s => s.id === slotId);

      if (!piece || !slot || piece.isPlaced || slot.isFilled) return;

      // Doğru cevap kontrolü
      if (piece.content === slot.answer) {
        // Doğru yerleştirme - parçayı slot pozisyonuna taşı
        setPuzzlePieces(prev => 
          prev.map(p => p.id === piece.id ? { 
            ...p, 
            isPlaced: true, 
            x: slot.x, 
            y: slot.y 
          } : p)
        );
        
        setPuzzleSlots(prev => 
          prev.map(s => s.id === slotId ? { 
            ...s, 
            isFilled: true, 
            placedPiece: piece.id 
          } : s)
        );
        
        setScore(prev => prev + 10);
        
        // Oyun tamamlandı mı?
        setTimeout(() => {
          const allPlaced = puzzlePieces.every(p => p.id === piece.id || p.isPlaced);
          if (allPlaced) {
            setGameCompleted(true);
            setTimeout(() => setShowFinalImage(true), 1000);
          }
        }, 100);
      } else {
        // Yanlış yerleştirme - puan düş
        setScore(prev => Math.max(0, prev - 5));
      }
    };

    // Drag over
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    // Timer
    useEffect(() => {
      if (timeLeft > 0 && !gameCompleted) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        setGameCompleted(true);
      }
    }, [timeLeft, gameCompleted]);

    // Oyun başlatılmamışsa başlat
    if (puzzlePieces.length === 0) {
      startGame();
    }

    if (gameCompleted) {
      const correctAnswers = puzzleSlots.filter(slot => slot.isFilled).length;
      return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            <Card className="card-matrix max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🧩</div>
                  <h2 className="text-3xl font-bold mb-4">Yapboz Tamamlandı!</h2>
                  <div className="text-4xl font-bold text-primary mb-4">{score} Puan</div>
                  <p className="text-muted-foreground mb-2">
                    {correctAnswers} / {puzzleData.length} doğru cevap
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {timeLeft > 0 ? "Harika! Yapbozu başarıyla tamamladınız!" : "Süre doldu! Tekrar deneyin."}
                  </p>
                </div>

                {/* Tamamlanan Yapboz Resmi */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-center mb-6 text-primary">
                    🛡️ Siber Güvenlik Kalesi 🛡️
                  </h3>
                  
                  {/* Yapboz Resmi - 3x3 Grid */}
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 p-6 rounded-2xl border-4 border-amber-300 dark:border-amber-700 mx-auto max-w-md">
                    <div className="grid grid-cols-3 gap-2">
                      {puzzleSlots.map((slot, index) => {
                        const row = Math.floor(index / 3);
                        const col = index % 3;
                        const isEdge = row === 0 || row === 2 || col === 0 || col === 2;
                        
                        return (
                          <div
                            key={slot.id}
                            className="relative aspect-square border-2 border-green-500 bg-green-100 dark:bg-green-900/30 p-3 flex flex-col items-center justify-center text-center"
                            style={{
                              clipPath: isEdge ? getPuzzleClipPath(row, col) : 'none',
                              borderRadius: isEdge ? '0' : '8px'
                            }}
                          >
                            <div className="text-center">
                              <div className="text-xl mb-1">
                                {puzzleData[slot.id].emoji}
                              </div>
                              <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                {slot.answer}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resim Açıklaması */}
                  <div className="mt-6 text-center">
                    <p className="text-lg font-semibold text-primary mb-2">
                      🎉 Tebrikler! Siber Güvenlik Kalesi Tamamlandı! 🎉
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Tüm güvenlik katmanlarını başarıyla birleştirdiniz. Bu kale, siber dünyada güvende olmanız için gerekli tüm unsurları içerir.
                    </p>
                    
                    {/* Güvenlik Katmanları Açıklaması */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🛡️</div>
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">Koruma</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Firewall, Şifreleme, 2FA</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🔍</div>
                        <h4 className="font-semibold text-green-700 dark:text-green-300">Tespit</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">Vulnerability Scan, Penetration Test</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🚨</div>
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300">Müdahale</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Incident Response, Risk Assessment</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <Button onClick={startGame} className="mr-4">
                    Tekrar Oyna
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGameType(null)}>
                    Ana Menüye Dön
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">🧩 Siber Güvenlik Yapbozu</h1>
              <div className="flex justify-center items-center gap-4 mb-6">
                <Badge variant="outline">Puan: {score}</Badge>
                <Badge className="bg-primary">
                  Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Badge>
                <Badge className="bg-green-500">
                  Tamamlanan: {puzzleSlots.filter(s => s.isFilled).length} / {puzzleData.length}
                </Badge>
              </div>
            </div>

            {/* Yapboz Oyun Alanı */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl border-2 border-slate-600 shadow-2xl min-h-[600px]">
              {/* Dekoratif çerçeve */}
              <div className="absolute inset-2 border-2 border-cyan-400/30 rounded-2xl"></div>
              <div className="absolute inset-4 border border-cyan-300/20 rounded-xl"></div>
              
              {/* Yapboz Tahtası - Sabit pozisyonlar */}
              <div className="absolute top-8 left-8 w-96 h-96">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">🧩 Yapboz Tahtası</h3>
                <div className="relative w-full h-full">
                  {puzzleSlots.map((slot, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const isEdge = row === 0 || row === 2 || col === 0 || col === 2;
                    
                    return (
                      <div
                        key={slot.id}
                        className={`absolute w-24 h-24 p-2 flex flex-col items-center justify-center text-center transition-all duration-500 group ${
                          slot.isFilled 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-400 shadow-lg shadow-green-500/30' 
                            : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-500 hover:from-slate-600 hover:to-slate-700 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20'
                        }`}
                        style={{
                          left: col * 100,
                          top: row * 100,
                          clipPath: isEdge ? getPuzzleClipPath(row, col) : 'none',
                          borderRadius: isEdge ? '0' : '12px'
                        }}
                        onDrop={(e) => handleDrop(e, slot.id)}
                        onDragOver={handleDragOver}
                      >
                        {/* Glow efekti */}
                        {slot.isFilled && (
                          <div className="absolute inset-0 bg-green-400/20 rounded-lg animate-pulse"></div>
                        )}
                        
                        {slot.isFilled ? (
                          <div className="relative z-10 text-center">
                            <div className="text-lg mb-1 animate-bounce">
                              {puzzleData[slot.id].emoji}
                            </div>
                            <div className="text-xs font-bold text-white">
                              {slot.answer}
                            </div>
                          </div>
                        ) : (
                          <div className="relative z-10 text-center">
                            <div className="text-xs text-slate-300 mb-1 font-medium leading-tight">
                              {slot.question}
                            </div>
                            <div className="text-xs text-cyan-400 font-semibold animate-pulse">
                              ✨
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yapboz Parçaları - Rastgele pozisyonlar */}
              <div className="absolute top-8 right-8 w-96 h-96">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">🎯 Yapboz Parçaları</h3>
                <div className="relative w-full h-full">
                  {puzzlePieces.map((piece, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const isEdge = row === 0 || row === 2 || col === 0 || col === 2;
                    
                    return (
                      <div
                        key={piece.id}
                        draggable={!piece.isPlaced}
                        onDragStart={(e) => handleDragStart(e, piece.id)}
                        onDragEnd={handleDragEnd}
                        className={`absolute w-24 h-24 p-2 flex items-center justify-center text-center transition-all duration-500 group ${
                          piece.isPlaced 
                            ? 'opacity-0 cursor-not-allowed' 
                            : 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 hover:from-blue-400 hover:to-blue-500 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/30 cursor-move'
                        }`}
                        style={{
                          left: piece.x,
                          top: piece.y,
                          clipPath: isEdge ? getPuzzleClipPath(row, col) : 'none',
                          borderRadius: isEdge ? '0' : '12px'
                        }}
                      >
                        {/* Glow efekti */}
                        {!piece.isPlaced && (
                          <div className="absolute inset-0 bg-blue-400/20 rounded-lg group-hover:animate-pulse"></div>
                        )}
                        
                        <div className="relative z-10 text-xs font-bold text-white group-hover:text-blue-100">
                          {piece.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alt yazı */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-slate-400">
                  Parçaları sürükleyip doğru yerlere yerleştirin
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button onClick={startGame} variant="outline">
                Yeniden Başla
                <RotateCcw className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Kelime bulmaca oyunu component'i
  const WordSearchGame = () => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [words, setWords] = useState<{word: string, found: boolean, positions: number[][]}[]>([]);
    const [selectedCells, setSelectedCells] = useState<number[][]>([]);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 dakika

    const wordList = [
      'FIREWALL', 'MALWARE', 'PHISHING', 'RISK', 'SECURITY',
      'VIRUS', 'HACK', 'PASSWORD', 'LOGIN', 'ALERT'
    ];

    // Grid oluştur
    const createGrid = () => {
      const size = 10;
      const newGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
      
      // Kelimeleri yerleştir
      const newWords = wordList.map(word => ({
        word,
        found: false,
        positions: []
      }));

      // Her kelimeyi rastgele pozisyona yerleştir
      newWords.forEach(wordObj => {
        const word = wordObj.word;
        const directions = [
          [0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1] // 8 yön
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 500) {
          const direction = directions[Math.floor(Math.random() * directions.length)];
          const startRow = Math.floor(Math.random() * size);
          const startCol = Math.floor(Math.random() * size);
          
          const endRow = startRow + direction[0] * (word.length - 1);
          const endCol = startCol + direction[1] * (word.length - 1);
          
          if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
            const positions: number[][] = [];
            let canPlace = true;
            
            // Önce pozisyonları kontrol et - boş olmalı
            for (let i = 0; i < word.length; i++) {
              const row = startRow + direction[0] * i;
              const col = startCol + direction[1] * i;
              
              if (newGrid[row][col] !== '') {
                canPlace = false;
                break;
              }
              positions.push([row, col]);
            }
            
            // Sonra yerleştirme yap
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                const row = startRow + direction[0] * i;
                const col = startCol + direction[1] * i;
                newGrid[row][col] = word[i];
              }
              wordObj.positions = positions;
              placed = true;
            }
          }
          attempts++;
        }
      });

      // Boş kalan hücreleri rastgele harflerle doldur
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (newGrid[i][j] === '') {
            newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          }
        }
      }

      setGrid(newGrid);
      setWords(newWords);
      
      // Debug: Kelimelerin pozisyonlarını konsola yazdır
      console.log('Kelime pozisyonları:');
      newWords.forEach(wordObj => {
        if (wordObj.positions.length > 0) {
          console.log(`${wordObj.word}:`, wordObj.positions);
        } else {
          console.log(`${wordObj.word}: YERLEŞTİRİLEMEDİ!`);
        }
      });
    };

    // Oyunu başlat
    const startGame = () => {
      createGrid();
      setScore(0);
      setGameCompleted(false);
      setTimeLeft(180);
      setSelectedCells([]);
    };

    // Hücre seç
    const selectCell = (row: number, col: number) => {
      // Eğer hücre zaten seçiliyse, seçimi kaldır
      if (selectedCells.some(([r, c]) => r === row && c === col)) {
        setSelectedCells(selectedCells.filter(([r, c]) => !(r === row && c === col)));
        return;
      }

      const newSelected = [...selectedCells, [row, col]];
      
      // Eğer bu ilk seçim değilse, sıralı olup olmadığını kontrol et
      if (selectedCells.length > 0) {
        const lastSelected = selectedCells[selectedCells.length - 1];
        const [lastRow, lastCol] = lastSelected;
        
        // Komşu hücre mi kontrol et (yatay, dikey, çapraz)
        const isAdjacent = Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1 && 
                          !(row === lastRow && col === lastCol);
        
        if (!isAdjacent) {
          // Komşu değilse, yeni seçim başlat
          setSelectedCells([[row, col]]);
          return;
        }
      }
      
      setSelectedCells(newSelected);

      // Seçilen hücrelerden kelime oluşuyor mu kontrol et
      if (newSelected.length >= 2) {
        // Tüm kelimeleri kontrol et
        for (const wordObj of words) {
          if (wordObj.found) continue;
          
          // Kelimenin pozisyonlarını kontrol et
          const wordPositions = wordObj.positions;
          if (wordPositions.length === 0) continue;
          
          // Seçilen hücrelerin kelime pozisyonlarıyla eşleşip eşleşmediğini kontrol et
          const isMatch = newSelected.length === wordPositions.length && 
            newSelected.every(([r, c]) => 
              wordPositions.some(([wr, wc]) => wr === r && wc === c)
            );
          
          if (isMatch) {
            // Kelime bulundu!
            setWords(prev => prev.map(w => 
              w.word === wordObj.word ? { ...w, found: true } : w
            ));
            setScore(prev => prev + 10);
            setSelectedCells([]);
            
            // Oyun tamamlandı mı?
            setTimeout(() => {
              const allFound = words.every(w => w.word === wordObj.word || w.found);
              if (allFound) {
                setGameCompleted(true);
              }
            }, 100);
            return;
          }
        }
        
        // Eğer hiçbir kelime bulunamadı ve 3+ hücre seçildiyse, seçimi temizle
        if (newSelected.length >= 3) {
          setTimeout(() => setSelectedCells([]), 1000);
        }
      }
    };

    // Timer
    useEffect(() => {
      if (timeLeft > 0 && !gameCompleted) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        setGameCompleted(true);
      }
    }, [timeLeft, gameCompleted]);

    // Oyun başlatılmamışsa başlat
    if (grid.length === 0) {
      startGame();
    }

    if (gameCompleted) {
      const foundCount = words.filter(w => w.found).length;
      return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            <Card className="card-matrix max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-3xl font-bold mb-4">Kelime Bulmaca Tamamlandı!</h2>
                <div className="text-4xl font-bold text-primary mb-4">{score} Puan</div>
                <p className="text-muted-foreground mb-2">
                  {foundCount} / {wordList.length} kelime bulundu
                </p>
                <p className="text-muted-foreground mb-6">
                  {timeLeft > 0 ? "Harika! Tüm kelimeleri buldunuz!" : "Süre doldu! Tekrar deneyin."}
                </p>
                <div className="space-y-2">
                  <Button onClick={startGame} className="mr-4">
                    Tekrar Oyna
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGameType(null)}>
                    Ana Menüye Dön
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">🔍 Kelime Bulmaca</h1>
              <div className="flex justify-center items-center gap-4 mb-6">
                <Badge variant="outline">Puan: {score}</Badge>
                <Badge className="bg-primary">
                  Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Badge>
                <Badge className="bg-green-500">
                  Bulunan: {words.filter(w => w.found).length} / {wordList.length}
                </Badge>
              </div>
            </div>

            {/* Ana oyun alanı - Yan yana düzen */}
            <div className="flex gap-8 items-start">
              {/* Sol taraf - Kelime bulmaca grid'i */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 text-center text-cyan-400">🔍 Kelime Bulmaca</h3>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-2xl border-2 border-slate-600 shadow-2xl">
                  <div className="grid grid-cols-10 gap-3 w-fit mx-auto">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
                    const isFound = words.some(w => 
                      w.found && w.positions.some(([r, c]) => r === rowIndex && c === colIndex)
                    );
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-14 h-14 flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-200 border-2 ${
                          isFound 
                            ? 'bg-green-500 text-white border-green-400' 
                            : isSelected 
                            ? 'bg-blue-500 text-white border-blue-400 shadow-lg' 
                            : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => selectCell(rowIndex, colIndex)}
                      >
                        {cell}
                      </div>
                    );
                  })
                )}
                  </div>
                </div>
              </div>

              {/* Sağ taraf - Kelime listesi */}
              <div className="w-80">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">📝 Aranacak Kelimeler:</h3>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-600">
                  <div className="grid grid-cols-2 gap-3">
                    {wordList.map((word, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-center font-bold text-lg transition-all duration-300 ${
                          words.find(w => w.word === word)?.found 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Badge className="bg-blue-500 px-3 py-1">
                    Bulunan: {words.filter(w => w.found).length} / {wordList.length}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="mb-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">🎯 Nasıl Oynanır:</h3>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Kelimeleri sıralı olarak seçin (R-I-S-K gibi)</li>
                  <li>• Komşu hücreleri seçin (yatay, dikey, çapraz)</li>
                  <li>• Doğru kelimeyi bulduğunuzda otomatik işaretlenir</li>
                  <li>• Tüm kelimeleri bulun ve puan toplayın!</li>
                </ul>
              </div>
              <Button onClick={startGame} variant="outline">
                Yeniden Başla
                <RotateCcw className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Senaryo oyunu component'i
  const ScenarioGame = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 dakika

    const scenarios = [
      {
        title: "Phishing E-postası",
        description: "Şirketinizde çalışan bir kişi, bankanızdan geldiğini iddia eden bir e-posta aldı. E-posta, hesap bilgilerinizi güncellemek için bir linke tıklamanızı istiyor. E-posta gerçekçi görünüyor ve bankanızın logosunu içeriyor.",
        question: "Bu durumda ne yapmalısınız?",
        options: [
          "E-postadaki linke tıklayıp bilgileri güncelle",
          "E-postayı sil ve bankanızı arayarak durumu bildir",
          "E-postayı tüm çalışanlara ileterek uyar",
          "E-postayı IT departmanına ilet ve şüpheli olarak işaretle"
        ],
        correct: 3,
        explanation: "Phishing e-postaları güvenlik tehditleridir. IT departmanına bildirmek ve şüpheli olarak işaretlemek en güvenli yaklaşımdır."
      },
      {
        title: "Ransomware Saldırısı",
        description: "Bilgisayarınızda tüm dosyalarınız şifrelendi ve ekranda bir mesaj belirdi. Mesaj, dosyalarınızı geri almak için 1000 dolar ödeme yapmanızı istiyor. Aksi takdirde dosyalarınız silinecek.",
        question: "Bu durumda ne yapmalısınız?",
        options: [
          "İstenen miktarı ödeyerek dosyaları geri al",
          "Bilgisayarı kapat ve IT departmanından yardım iste",
          "Antivirus yazılımı çalıştır",
          "Dosyaları manuel olarak şifresini çözmeye çalış"
        ],
        correct: 1,
        explanation: "Ransomware saldırılarında asla fidye ödenmemelidir. IT departmanından profesyonel yardım almak en doğru yaklaşımdır."
      },
      {
        title: "Sosyal Mühendislik",
        description: "Telefonda kendini IT departmanından biri olarak tanıtan bir kişi, sistem güncellemesi yapmak için şifrenizi istiyor. Kişi, acil bir güvenlik güncellemesi olduğunu ve hemen şifrenizi vermeniz gerektiğini söylüyor.",
        question: "Bu durumda ne yapmalısınız?",
        options: [
          "Şifreyi ver çünkü acil bir durum",
          "Kişinin kimliğini doğrula ve IT departmanından onay al",
          "Şifreyi e-posta ile gönder",
          "Kişiyi geri arayarak kimliğini doğrula"
        ],
        correct: 1,
        explanation: "Gerçek IT personeli asla şifre istemez. Kimliği doğrulamak ve resmi kanallardan onay almak gerekir."
      },
      {
        title: "USB Cihaz Bulma",
        description: "Ofis binasının girişinde bilinmeyen bir USB cihaz buldunuz. Cihaz üzerinde 'Personel Listesi' yazıyor ve şirket logosu var.",
        question: "Bu USB cihazı ile ne yapmalısınız?",
        options: [
          "Bilgisayarınıza takıp içeriğini kontrol et",
          "Güvenlik departmanına teslim et",
          "Kayıp eşya bürosuna bırak",
          "Çöpe at"
        ],
        correct: 1,
        explanation: "Bilinmeyen USB cihazları güvenlik riski oluşturabilir. Güvenlik departmanına teslim etmek en güvenli yaklaşımdır."
      },
      {
        title: "Şifre Güvenliği",
        description: "Yeni bir hesap oluştururken, sistem güçlü bir şifre istiyor. Mevcut şifrelerinizden birini kullanmak istiyorsunuz çünkü hatırlamak kolay.",
        question: "Bu durumda ne yapmalısınız?",
        options: [
          "Mevcut şifreyi kullan çünkü hatırlamak kolay",
          "Yeni, güçlü ve benzersiz bir şifre oluştur",
          "Şifreyi bir kağıda yazıp masanın altına yapıştır",
          "Şifre yöneticisi kullan"
        ],
        correct: 3,
        explanation: "Her hesap için benzersiz, güçlü şifreler kullanmak ve şifre yöneticisi kullanmak en güvenli yaklaşımdır."
      }
    ];

    // Oyunu başlat
    const startGame = () => {
      setCurrentScenario(0);
      setSelectedAnswer(null);
      setScore(0);
      setGameCompleted(false);
      setTimeLeft(300);
    };

    // Cevap seç
    const selectAnswer = (answerIndex: number) => {
      setSelectedAnswer(answerIndex);
    };

    // Sonraki senaryo
    const nextScenario = () => {
      if (selectedAnswer !== null) {
        // Puan hesapla
        if (selectedAnswer === scenarios[currentScenario].correct) {
          setScore(prev => prev + 20);
        }

        // Sonraki senaryoya geç
        if (currentScenario < scenarios.length - 1) {
          setCurrentScenario(prev => prev + 1);
          setSelectedAnswer(null);
        } else {
          setGameCompleted(true);
        }
      }
    };

    // Timer
    useEffect(() => {
      if (timeLeft > 0 && !gameCompleted) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        setGameCompleted(true);
      }
    }, [timeLeft, gameCompleted]);

    if (gameCompleted) {
      const correctAnswers = Math.floor(score / 20);
      return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            <Card className="card-matrix max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">💡</div>
                <h2 className="text-3xl font-bold mb-4">Senaryo Oyunu Tamamlandı!</h2>
                <div className="text-4xl font-bold text-primary mb-4">{score} Puan</div>
                <p className="text-muted-foreground mb-2">
                  {correctAnswers} / {scenarios.length} doğru cevap
                </p>
                <p className="text-muted-foreground mb-6">
                  {timeLeft > 0 ? "Harika! Siber güvenlik senaryolarını başarıyla çözdünüz!" : "Süre doldu! Tekrar deneyin."}
                </p>
                <div className="space-y-2">
                  <Button onClick={startGame} className="mr-4">
                    Tekrar Oyna
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGameType(null)}>
                    Ana Menüye Dön
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    const scenario = scenarios[currentScenario];

    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">💡 Senaryo Oyunu</h1>
              <div className="flex justify-center items-center gap-4 mb-6">
                <Badge variant="outline">Puan: {score}</Badge>
                <Badge className="bg-primary">
                  Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Badge>
                <Badge className="bg-blue-500">
                  Senaryo: {currentScenario + 1} / {scenarios.length}
                </Badge>
              </div>
            </div>

            <Card className="card-matrix">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 text-primary">{scenario.title}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">{scenario.question}</h3>
                  <div className="space-y-3">
                    {scenario.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className={`w-full justify-start text-left h-auto p-4 ${
                          selectedAnswer === index ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => selectAnswer(index)}
                      >
                        <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={nextScenario}
                    disabled={selectedAnswer === null}
                    className="btn-cyber"
                  >
                    {currentScenario === scenarios.length - 1 ? "Sonuçları Gör" : "Sonraki Senaryo"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Hafıza oyunu component'i
  const MemoryGame = () => {
    const [cards, setCards] = useState<{id: number, content: string, isFlipped: boolean, isMatched: boolean}[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const memoryItems = [
      "🛡️", "🔒", "🔐", "🛡️", "🔒", "🔐",
      "⚡", "🎯", "⚡", "🎯", "🔍", "🔍"
    ];

    // Oyunu başlat
    const startGame = () => {
      const shuffledItems = [...memoryItems].sort(() => Math.random() - 0.5);
      const newCards = shuffledItems.map((item, index) => ({
        id: index,
        content: item,
        isFlipped: false,
        isMatched: false
      }));
      setCards(newCards);
      setFlippedCards([]);
      setMoves(0);
      setScore(0);
      setGameCompleted(false);
    };

    // Kart çevir
    const flipCard = (cardId: number) => {
      if (flippedCards.length >= 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
        return;
      }

      const newCards = cards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      );
      setCards(newCards);

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setMoves(prev => prev + 1);
        
        // Eşleşme kontrolü
        const [firstId, secondId] = newFlippedCards;
        const firstCard = newCards[firstId];
        const secondCard = newCards[secondId];

        if (firstCard.content === secondCard.content) {
          // Eşleşme bulundu
          setTimeout(() => {
            setCards(prevCards => 
              prevCards.map(card => 
                card.id === firstId || card.id === secondId 
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            setScore(prev => prev + 10);
            
            // Tüm kartlar eşleşti mi?
            const allMatched = newCards.every(card => 
              card.id === firstId || card.id === secondId || card.isMatched
            );
            if (allMatched) {
              setGameCompleted(true);
            }
          }, 500);
        } else {
          // Eşleşme yok - kartları geri çevir
          setTimeout(() => {
            setCards(prevCards => 
              prevCards.map(card => 
                card.id === firstId || card.id === secondId 
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
          }, 1000);
        }
        
        setFlippedCards([]);
      }
    };

    // Oyun başlatılmamışsa başlat
    if (cards.length === 0) {
      startGame();
    }

    if (gameCompleted) {
      return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            <Card className="card-matrix max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-3xl font-bold mb-4">Hafıza Oyunu Tamamlandı!</h2>
                <div className="text-4xl font-bold text-primary mb-4">{score} Puan</div>
                <p className="text-muted-foreground mb-2">
                  {moves} hamlede tamamladınız!
                </p>
                <p className="text-muted-foreground mb-6">
                  Harika hafıza performansı!
                </p>
                <div className="space-y-2">
                  <Button onClick={startGame} className="mr-4">
                    Tekrar Oyna
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGameType(null)}>
                    Ana Menüye Dön
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">⚡ Hafıza Oyunu</h1>
              <div className="flex justify-center items-center gap-4 mb-6">
                <Badge variant="outline">Puan: {score}</Badge>
                <Badge className="bg-primary">Hamle: {moves}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-2xl mx-auto">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  variant="outline"
                  className={`aspect-square h-20 text-2xl ${
                    card.isFlipped || card.isMatched 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  } ${card.isMatched ? "opacity-50" : ""}`}
                  onClick={() => flipCard(card.id)}
                  disabled={card.isMatched}
                >
                  {card.isFlipped || card.isMatched ? card.content : "?"}
                </Button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button onClick={startGame} variant="outline">
                Yeniden Başla
                <RotateCcw className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
  // Oyun türüne göre oyunu render et
  if (selectedGameType && gameStarted) {
    switch (selectedGameType) {
      case "quiz":
        return <QuizGame />;
      case "matching":
        return <MatchingGame />;
      case "memory":
        return <MemoryGame />;
      case "puzzle":
        return <PuzzleGame />;
      case "wordsearch":
        return <WordSearchGame />;
      case "scenario":
        return <ScenarioGame />;
      default:
        return <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
          <Card className="card-matrix max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Bilinmeyen Oyun</h2>
              <Button onClick={() => setSelectedGameType(null)}>Ana Menüye Dön</Button>
            </CardContent>
          </Card>
        </div>;
    }
  }

  // Oyun türü seçim ekranı
  if (!selectedGameType) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl mb-6 shadow-lg">
              <Gamepad2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent animate-pulse">
              🎮 Siber Güvenlik Oyunları
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Farklı oyun türleriyle siber güvenlik becerilerinizi geliştirin ve eğlenerek öğrenin
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                🏆 Ödüllü Oyunlar
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                ⚡ Hızlı Öğrenme
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-green-500/10 text-green-500 border-green-500/20">
                🎯 Etkileşimli
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameTypes.map((game) => {
              const IconComponent = game.icon;
              return (
                <Card 
                  key={game.id} 
                  className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
                  onClick={() => startGame(game.id)}
                >
                  <CardContent className="p-8 relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${game.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-10 w-10" />
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                          <Gamepad2 className="h-3 w-3 mr-1" />
                          Oyun
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {game.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                        {game.description}
                      </p>
                      
                      <Button 
                        className={`w-full h-12 ${game.color} ${game.hoverColor} text-white font-semibold text-base group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                        onClick={() => startGame(game.id)}
                      >
                        <Gamepad2 className="mr-2 h-5 w-5" />
                        Oyunu Başlat
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-transparent group-hover:from-white/10 transition-colors duration-300"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-white/3 to-transparent group-hover:from-white/8 transition-colors duration-300"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* İstatistikler */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-blue-500 mb-2">6</div>
                <div className="text-sm text-muted-foreground font-medium">Oyun Türü</div>
              </CardContent>
            </Card>
            
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-500 mb-2">25K+</div>
                <div className="text-sm text-muted-foreground font-medium">Aktif Oyuncu</div>
              </CardContent>
            </Card>
            
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-500 mb-2">150+</div>
                <div className="text-sm text-muted-foreground font-medium">Toplam Seviye</div>
              </CardContent>
            </Card>
            
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                </div>
                <div className="text-3xl font-bold text-yellow-500 mb-2">4.9</div>
                <div className="text-sm text-muted-foreground font-medium">Ortalama Puan</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Quiz seçim ekranı (oyun türü seçildikten sonra)
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen pt-20">
        {/* Header */}
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedGameType(null)}
            className="mb-4"
          >
            ← Oyun Türlerine Dön
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              {gameTypes.find(g => g.id === selectedGameType)?.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {gameTypes.find(g => g.id === selectedGameType)?.description}
            </p>
          </div>
        </div>

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