// Haber servisi - Dinamik haber yönetimi için
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: 'threats' | 'updates' | 'tools' | 'education' | 'reports';
  severity: 'high' | 'medium' | 'low';
  timeAgo: string;
  readTime: string;
  source: string;
  image: string;
  url?: string;
  publishedAt: string;
  tags: string[];
  isBreaking?: boolean;
}

// Ana haber çekme fonksiyonu - API + Mock veri karışımı
export const fetchNews = async (category?: string, search?: string): Promise<NewsItem[]> => {
  try {
    // Önce NewsAPI'den gerçek haberleri çekmeyi dene
    const apiNews = await fetchFromNewsAPI();
    
    if (apiNews && apiNews.length > 0) {
      console.log('NewsAPI\'den haberler çekildi:', apiNews.length);
      
      // API haberlerini filtrele
      let filteredApiNews = apiNews;
      
      if (category && category !== 'all') {
        filteredApiNews = filteredApiNews.filter(news => news.category === category);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredApiNews = filteredApiNews.filter(news => 
          news.title.toLowerCase().includes(searchLower) ||
          news.summary.toLowerCase().includes(searchLower) ||
          news.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // API haberleri varsa onları döndür
      if (filteredApiNews.length > 0) {
        return filteredApiNews;
      }
    }
  } catch (error) {
    console.warn('NewsAPI hatası, mock veriler kullanılıyor:', error);
  }
  
  // API çalışmazsa mock verileri kullan
  console.log('Mock veriler kullanılıyor');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allNews: NewsItem[] = [
    {
      id: "1",
      title: "LockBit 3.0 Ransomware: Kritik Altyapıları Hedef Alıyor",
      summary: "Yeni ransomware türü, hastaneler ve enerji santrallerini hedef alıyor. Uzmanlar acil güvenlik önlemleri alınmasını tavsiye ediyor.",
      content: "LockBit 3.0 ransomware'ı, son dönemde kritik altyapıları hedef alan yeni bir tehdit olarak ortaya çıktı. Bu zararlı yazılım, özellikle sağlık sektörü ve enerji santrallerini hedef alıyor. Siber güvenlik uzmanları, bu tür saldırılara karşı alınması gereken önlemler konusunda uyarılar yayınlıyor. Ransomware'ın yayılma hızı ve şifreleme algoritması, geleneksel güvenlik önlemlerini aşabiliyor.",
      category: "threats",
      severity: "high",
      timeAgo: "15 dakika önce",
      readTime: "4 dk",
      source: "CyberGuard Security Lab",
      image: "🚨",
      url: "https://example.com/news/lockbit-3-0",
      publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      tags: ["ransomware", "lockbit", "kritik-altyapı", "hastane", "enerji"],
      isBreaking: true
    },
    {
      id: "2", 
      title: "Microsoft Windows'ta Zero-Day Açığı: Acil Patch Gerekli",
      summary: "Windows 11 ve Windows Server 2022'de tespit edilen kritik güvenlik açığı, uzaktan kod çalıştırma imkanı sağlıyor.",
      content: "Microsoft, Windows 11 ve Windows Server 2022'de tespit edilen kritik bir güvenlik açığını kapattı. CVE-2024-XXXX numaralı açık, saldırganların sistem üzerinde uzaktan kod çalıştırmasına olanak sağlıyor. Güvenlik açığı, özellikle kurumsal ağlarda yaygın kullanılan Windows servislerini etkiliyor.",
      category: "updates",
      severity: "high",
      timeAgo: "2 saat önce", 
      readTime: "3 dk",
      source: "Microsoft Security Response Center",
      image: "🔧",
      url: "https://example.com/news/microsoft-zero-day",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tags: ["microsoft", "windows", "zero-day", "cve", "patch"],
      isBreaking: true
    },
    {
      id: "3",
      title: "Nmap 7.95 Sürümü: Gelişmiş Port Tarama ve Güvenlik Testi",
      summary: "Açık kaynak güvenlik tarayıcısı Nmap'in yeni sürümü, gelişmiş port tarama algoritmaları ve yeni güvenlik açığı tespit modülleri ile geldi.",
      content: "Nmap'in 7.95 sürümü, siber güvenlik uzmanları için önemli iyileştirmeler getiriyor. Yeni sürümde, daha hızlı port tarama algoritmaları, gelişmiş OS fingerprinting ve yeni güvenlik açığı tespit modülleri bulunuyor. Ayrıca, IPv6 desteği ve modern protokoller için geliştirilmiş tarama teknikleri eklendi.",
      category: "tools",
      severity: "low",
      timeAgo: "4 saat önce",
      readTime: "3 dk", 
      source: "Nmap Development Team",
      image: "🛠️",
      url: "https://example.com/news/nmap-7-95",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      tags: ["nmap", "port-tarama", "güvenlik-testi", "açık-kaynak", "penetrasyon-testi"],
      isBreaking: false
    },
    {
      id: "4",
      title: "AI Destekli Siber Saldırılar: 2024'te %300 Artış",
      summary: "Yapay zeka teknolojilerinin kötüye kullanımı ile gerçekleştirilen siber saldırılarda dramatik artış gözlemlendi.",
      content: "2024 yılında yapay zeka destekli siber saldırılarda %300 artış kaydedildi. Saldırganlar, AI teknolojilerini kullanarak daha sofistike phishing e-postaları, deepfake içerikler ve otomatik saldırı botları geliştiriyor. Bu durum, siber güvenlik uzmanlarının savunma stratejilerini yeniden gözden geçirmesini gerektiriyor.",
      category: "reports", 
      severity: "medium",
      timeAgo: "6 saat önce",
      readTime: "5 dk",
      source: "Cybersecurity Research Institute",
      image: "🤖",
      url: "https://example.com/news/ai-cyber-attacks-2024",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      tags: ["yapay-zeka", "siber-saldırı", "phishing", "deepfake", "otomasyon"],
      isBreaking: false
    },
    {
      id: "5",
      title: "Siber Güvenlik Uzmanları İçin Ücretsiz Sertifika Programı",
      summary: "CyberGuard platformu, siber güvenlik uzmanları için kapsamlı ücretsiz sertifika programını başlatıyor.",
      content: "CyberGuard platformu, siber güvenlik alanında çalışan veya bu alana ilgi duyan profesyoneller için kapsamlı bir sertifika programı başlatıyor. Program, etik hacking, ağ güvenliği, olay müdahale ve güvenlik analizi konularını kapsıyor. Tüm eğitimler ücretsiz ve online olarak sunulacak.",
      category: "education",
      severity: "low", 
      timeAgo: "8 saat önce",
      readTime: "3 dk",
      source: "CyberGuard Eğitim Merkezi",
      image: "📚",
      url: "https://example.com/news/cybersecurity-certification",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      tags: ["sertifika", "eğitim", "etik-hacking", "ağ-güvenliği", "olay-müdahale"],
      isBreaking: false
    },
    {
      id: "6",
      title: "Phishing Saldırıları: E-posta Güvenliği Kritik Seviyede",
      summary: "Son 3 ayda phishing saldırılarında %250 artış gözlemlendi. Kurumsal e-posta güvenliği önlemleri acil güncelleme gerektiriyor.",
      content: "Anti-Phishing Working Group'un son raporuna göre, son 3 ayda phishing saldırılarında %250 artış kaydedildi. Saldırganlar, özellikle kurumsal e-posta sistemlerini hedef alıyor ve sosyal mühendislik teknikleri kullanarak çalışanları aldatmaya çalışıyor. Bu durum, e-posta güvenliği önlemlerinin acil olarak güncellenmesini gerektiriyor.",
      category: "threats",
      severity: "high",
      timeAgo: "12 saat önce", 
      readTime: "4 dk",
      source: "Anti-Phishing Working Group",
      image: "🎣",
      url: "https://example.com/news/phishing-increase-2024",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      tags: ["phishing", "e-posta-güvenliği", "sosyal-mühendislik", "kurumsal-güvenlik"],
      isBreaking: false
    },
    {
      id: "7",
      title: "Metasploit Framework 6.4: Yeni Exploit Modülleri",
      summary: "Penetrasyon testi aracı Metasploit'in yeni sürümü, güncel güvenlik açıkları için yeni exploit modülleri içeriyor.",
      content: "Metasploit Framework'ün 6.4 sürümü, siber güvenlik uzmanları için önemli güncellemeler getiriyor. Yeni sürümde, son dönemde tespit edilen güvenlik açıkları için 15 yeni exploit modülü eklendi. Ayrıca, gelişmiş post-exploitation teknikleri ve daha iyi payload yönetimi özellikleri bulunuyor.",
      category: "tools",
      severity: "low",
      timeAgo: "1 gün önce",
      readTime: "3 dk",
      source: "Rapid7 Security",
      image: "⚔️",
      url: "https://example.com/news/metasploit-6-4",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      tags: ["metasploit", "penetrasyon-testi", "exploit", "payload", "güvenlik-testi"],
      isBreaking: false
    },
    {
      id: "8",
      title: "Kubernetes Güvenlik Açığı: Container Orchestration Risk Altında",
      summary: "Kubernetes platformunda tespit edilen kritik güvenlik açığı, container'ların güvenliğini tehdit ediyor.",
      content: "Kubernetes platformunda tespit edilen CVE-2024-XXXX numaralı güvenlik açığı, container orchestration sistemlerini etkiliyor. Açık, saldırganların container'lar arasında yetkisiz erişim sağlamasına olanak tanıyor. Bu durum, özellikle bulut tabanlı uygulamaları kullanan kurumları etkiliyor.",
      category: "threats",
      severity: "high",
      timeAgo: "1 gün önce",
      readTime: "4 dk",
      source: "Kubernetes Security Team",
      image: "☸️",
      url: "https://example.com/news/kubernetes-security-vulnerability",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      tags: ["kubernetes", "container", "güvenlik-açığı", "bulut-güvenliği", "orchestration"],
      isBreaking: false
    }
  ];

  // Filtreleme
  let filteredNews = allNews;
  
  if (category && category !== 'all') {
    filteredNews = filteredNews.filter(news => news.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredNews = filteredNews.filter(news => 
      news.title.toLowerCase().includes(searchLower) ||
      news.summary.toLowerCase().includes(searchLower) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  return filteredNews;
};

// Breaking news'i getir
export const fetchBreakingNews = async (): Promise<NewsItem[]> => {
  const allNews = await fetchNews();
  return allNews.filter(news => news.isBreaking);
};

// Kategoriye göre haber sayısını getir
export const getNewsCounts = async () => {
  const allNews = await fetchNews();
  return {
    all: allNews.length,
    threats: allNews.filter(n => n.category === 'threats').length,
    updates: allNews.filter(n => n.category === 'updates').length,
    tools: allNews.filter(n => n.category === 'tools').length,
    education: allNews.filter(n => n.category === 'education').length,
    reports: allNews.filter(n => n.category === 'reports').length
  };
};

// Haber detayını getir
export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
  const allNews = await fetchNews();
  return allNews.find(news => news.id === id) || null;
};

// Siber güvenlik odaklı RSS feed'leri
const CYBER_SECURITY_RSS_FEEDS = [
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "threats",
    language: "en"
  },
  {
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    category: "threats", 
    language: "en"
  },
  {
    name: "Dark Reading",
    url: "https://www.darkreading.com/rss.xml",
    category: "reports",
    language: "en"
  },
  {
    name: "SecurityWeek",
    url: "https://www.securityweek.com/rss",
    category: "updates",
    language: "en"
  },
  {
    name: "Threatpost",
    url: "https://threatpost.com/feed/",
    category: "threats",
    language: "en"
  },
  {
    name: "Bleeping Computer Security",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "tools",
    language: "en"
  },
  {
    name: "CSO Online",
    url: "https://www.csoonline.com/index.rss",
    category: "education",
    language: "en"
  },
  {
    name: "InfoSec Magazine",
    url: "https://www.infosecurity-magazine.com/rss/news/",
    category: "reports",
    language: "en"
  }
];

// RSS Feed entegrasyonu için (gelecekte)
export const fetchRSSFeeds = async () => {
  // RSS feed'leri burada işlenecek
  // Örnek: https://feeds.feedburner.com/TheHackersNews
  return CYBER_SECURITY_RSS_FEEDS;
};

// NewsAPI entegrasyonu - Siber güvenlik odaklı
export const fetchFromNewsAPI = async (apiKey?: string) => {
  const API_KEY = apiKey || process.env.REACT_APP_NEWS_API_KEY;
  
  if (!API_KEY) {
    console.warn('NewsAPI key bulunamadı. Mock veriler kullanılıyor.');
    return null;
  }

  try {
    // Siber güvenlik terimleri ile arama
    const cyberSecurityTerms = [
      'cybersecurity',
      'cyber security', 
      'information security',
      'ransomware',
      'phishing',
      'malware',
      'vulnerability',
      'CVE',
      'penetration testing',
      'ethical hacking',
      'data breach',
      'zero-day',
      'threat intelligence',
      'security awareness',
      'cyber attack'
    ];
    
    const query = cyberSecurityTerms.join(' OR ');
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`NewsAPI Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // NewsAPI verilerini bizim formatımıza çevir
    return data.articles?.map((article: any, index: number) => ({
      id: `api-${index}`,
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) + '...',
      content: article.content,
      category: categorizeNews(article.title, article.description),
      severity: determineSeverity(article.title, article.description),
      timeAgo: formatTimeAgo(article.publishedAt),
      readTime: calculateReadTime(article.content || article.description),
      source: article.source.name,
      image: getSecurityEmoji(article.title),
      url: article.url,
      publishedAt: article.publishedAt,
      tags: extractTags(article.title, article.description),
      isBreaking: isBreakingNews(article.title, article.description)
    })) || [];
    
  } catch (error) {
    console.error('NewsAPI hatası:', error);
    return null;
  }
};

// Yardımcı fonksiyonlar
const categorizeNews = (title: string, description: string): string => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('ransomware') || text.includes('phishing') || text.includes('malware') || text.includes('attack')) {
    return 'threats';
  }
  if (text.includes('update') || text.includes('patch') || text.includes('fix') || text.includes('cve')) {
    return 'updates';
  }
  if (text.includes('tool') || text.includes('software') || text.includes('framework') || text.includes('nmap')) {
    return 'tools';
  }
  if (text.includes('education') || text.includes('training') || text.includes('certification') || text.includes('course')) {
    return 'education';
  }
  if (text.includes('report') || text.includes('study') || text.includes('research') || text.includes('analysis')) {
    return 'reports';
  }
  
  return 'threats'; // Default
};

const determineSeverity = (title: string, description: string): string => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('critical') || text.includes('zero-day') || text.includes('urgent') || text.includes('emergency')) {
    return 'high';
  }
  if (text.includes('important') || text.includes('security') || text.includes('vulnerability')) {
    return 'medium';
  }
  
  return 'low';
};

const formatTimeAgo = (publishedAt: string): string => {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} saat önce`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} gün önce`;
  }
};

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content?.split(' ').length || 0;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} dk`;
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
  
  return '🛡️'; // Default security emoji
};

const extractTags = (title: string, description: string): string[] => {
  const text = (title + ' ' + description).toLowerCase();
  const tags: string[] = [];
  
  const tagKeywords = {
    'ransomware': 'ransomware',
    'phishing': 'phishing',
    'malware': 'malware',
    'vulnerability': 'güvenlik-açığı',
    'cve': 'cve',
    'zero-day': 'zero-day',
    'cybersecurity': 'siber-güvenlik',
    'penetration': 'penetrasyon-testi',
    'ethical hacking': 'etik-hacking',
    'data breach': 'veri-ihlali',
    'ai': 'yapay-zeka',
    'cloud': 'bulut-güvenliği',
    'container': 'container',
    'kubernetes': 'kubernetes'
  };
  
  Object.entries(tagKeywords).forEach(([keyword, tag]) => {
    if (text.includes(keyword)) {
      tags.push(tag);
    }
  });
  
  return tags;
};

const isBreakingNews = (title: string, description: string): boolean => {
  const text = (title + ' ' + description).toLowerCase();
  return text.includes('breaking') || text.includes('urgent') || text.includes('critical') || text.includes('zero-day');
};
