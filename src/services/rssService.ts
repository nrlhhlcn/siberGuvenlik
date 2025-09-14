// RSS Parser yerine fetch API kullanıyoruz

// Siber güvenlik RSS feed'leri
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
    category: "threats", 
    language: "en"
  },
  {
    name: "Security Week",
    url: "https://www.securityweek.com/rss",
    category: "updates",
    language: "en"
  },
  {
    name: "Threat Post",
    url: "https://threatpost.com/feed/",
    category: "threats",
    language: "en"
  },
  {
    name: "Bleeping Computer Security",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "threats",
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
    url: "https://www.infosecurity-magazine.com/rss/",
    category: "reports",
    language: "en"
  },
  {
    name: "Naked Security",
    url: "https://nakedsecurity.sophos.com/feed/",
    category: "threats",
    language: "en"
  },
  {
    name: "Türkiye Siber Güvenlik",
    url: "https://www.siberguvenlik.gov.tr/rss.xml",
    category: "updates",
    language: "tr"
  }
];

export interface RSSNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "threats" | "updates" | "tools" | "education" | "reports";
  severity: "high" | "medium" | "low";
  timeAgo: string;
  readTime: string;
  source: string;
  image: string;
  url: string;
  publishedAt: string;
  tags: string[];
  isBreaking: boolean;
  feedName: string;
  language: string;
}

// RSS feed'den haberleri çek (Fetch API ile)
export const fetchRSSNews = async (): Promise<RSSNewsItem[]> => {
  const allNews: RSSNewsItem[] = [];
  
  for (const feed of CYBER_SECURITY_RSS_FEEDS) {
    try {
      console.log(`RSS feed çekiliyor: ${feed.name}`);
      
      // CORS proxy kullanarak RSS feed'i çek
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        // XML'i parse et
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");
        
        if (items.length > 0) {
          const feedNews = Array.from(items).slice(0, 5).map((item, index) => {
            const title = item.querySelector("title")?.textContent || 'Başlık bulunamadı';
            const description = item.querySelector("description")?.textContent || '';
            const link = item.querySelector("link")?.textContent || '#';
            const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
            
            const newsItem: RSSNewsItem = {
              id: `rss-${feed.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
              title: title,
              summary: description.length > 300 ? description.substring(0, 300) + '...' : description,
              content: description.length > 500 ? description : description + '\n\n' + generateExtendedContent(title, description),
              category: feed.category as any,
              severity: determineSeverity(title, description),
              timeAgo: formatTimeAgo(new Date(pubDate)),
              readTime: calculateReadTime(description),
              source: feed.name,
              image: getSecurityEmoji(title),
              url: link,
              publishedAt: new Date(pubDate).toISOString(),
              tags: extractTags(title, description),
              isBreaking: isBreakingNews(title, description),
              feedName: feed.name,
              language: feed.language
            };
            
            return newsItem;
          });
          
          allNews.push(...feedNews);
          console.log(`${feed.name}: ${feedNews.length} haber eklendi`);
        }
      }
    } catch (error) {
      console.error(`${feed.name} RSS feed hatası:`, error);
      // Hata durumunda devam et
    }
  }
  
  // Tarihe göre sırala (en yeni önce)
  allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  console.log(`Toplam ${allNews.length} RSS haberi çekildi`);
  return allNews;
};

// Belirli bir RSS feed'den haber çek (Fetch API ile)
export const fetchSingleRSSFeed = async (feedUrl: string): Promise<RSSNewsItem[]> => {
  try {
    const feed = CYBER_SECURITY_RSS_FEEDS.find(f => f.url === feedUrl);
    if (!feed) return [];
    
    // CORS proxy kullanarak RSS feed'i çek
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) return [];
    
    // XML'i parse et
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    const items = xmlDoc.querySelectorAll("item");
    
    return Array.from(items).slice(0, 10).map((item, index) => {
      const title = item.querySelector("title")?.textContent || 'Başlık bulunamadı';
      const description = item.querySelector("description")?.textContent || '';
      const link = item.querySelector("link")?.textContent || '#';
      const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
      
      return {
        id: `rss-${feed.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        title: title,
        summary: description.length > 300 ? description.substring(0, 300) + '...' : description,
        content: description.length > 500 ? description : description + '\n\n' + generateExtendedContent(title, description),
        category: feed.category as any,
        severity: determineSeverity(title, description),
        timeAgo: formatTimeAgo(new Date(pubDate)),
        readTime: calculateReadTime(description),
        source: feed.name,
        image: getSecurityEmoji(title),
        url: link,
        publishedAt: new Date(pubDate).toISOString(),
        tags: extractTags(title, description),
        isBreaking: isBreakingNews(title, description),
        feedName: feed.name,
        language: feed.language
      };
    });
  } catch (error) {
    console.error('RSS feed hatası:', error);
    return [];
  }
};

// Yardımcı fonksiyonlar
const determineSeverity = (title: string, description: string): "high" | "medium" | "low" => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('critical') || text.includes('zero-day') || text.includes('urgent') || 
      text.includes('emergency') || text.includes('exploit') || text.includes('breach')) {
    return 'high';
  }
  if (text.includes('important') || text.includes('security') || text.includes('vulnerability') ||
      text.includes('attack') || text.includes('malware') || text.includes('ransomware')) {
    return 'medium';
  }
  
  return 'low';
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
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
  if (text.includes('breach') || text.includes('hack')) return '💥';
  if (text.includes('privacy') || text.includes('gdpr')) return '🔒';
  if (text.includes('crypto') || text.includes('blockchain')) return '₿';
  
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
    'kubernetes': 'kubernetes',
    'privacy': 'gizlilik',
    'gdpr': 'gdpr',
    'crypto': 'kripto',
    'blockchain': 'blockchain',
    'iot': 'iot',
    'mobile': 'mobil-güvenlik',
    'web': 'web-güvenliği',
    'network': 'ağ-güvenliği'
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
  return text.includes('breaking') || text.includes('urgent') || text.includes('critical') || 
         text.includes('zero-day') || text.includes('emergency') || text.includes('alert');
};

// Genişletilmiş içerik oluştur
const generateExtendedContent = (title: string, description: string): string => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  let extendedContent = '';
  
  // Siber güvenlik konularına göre ek içerik
  if (titleLower.includes('ransomware') || descLower.includes('ransomware')) {
    extendedContent = `
<h3>Ransomware Tehdidi Hakkında</h3>
<p>Ransomware, siber suçluların bilgisayar sistemlerini şifreleyerek fidye talep ettiği zararlı yazılım türüdür. Bu tür saldırılara karşı alınması gereken önlemler:</p>
<ul>
<li>Düzenli yedekleme yapın</li>
<li>Güvenlik yazılımlarını güncel tutun</li>
<li>Şüpheli e-postaları açmayın</li>
<li>Çok faktörlü kimlik doğrulama kullanın</li>
</ul>
    `;
  } else if (titleLower.includes('phishing') || descLower.includes('phishing')) {
    extendedContent = `
<h3>Phishing Saldırıları</h3>
<p>Phishing, kişisel bilgileri çalmak için sahte e-postalar ve web siteleri kullanan bir siber suç türüdür. Korunma yöntemleri:</p>
<ul>
<li>Gönderen adresini kontrol edin</li>
<li>Linklere tıklamadan önce URL'yi inceleyin</li>
<li>Kişisel bilgilerinizi e-posta ile paylaşmayın</li>
<li>Güvenlik eğitimi alın</li>
</ul>
    `;
  } else if (titleLower.includes('vulnerability') || titleLower.includes('cve') || descLower.includes('vulnerability')) {
    extendedContent = `
<h3>Güvenlik Açığı Yönetimi</h3>
<p>Güvenlik açıkları, sistemlerinizin güvenliğini tehdit edebilir. Etkili yönetim için:</p>
<ul>
<li>Güvenlik güncellemelerini hemen yükleyin</li>
<li>Düzenli güvenlik taraması yapın</li>
<li>Risk değerlendirmesi yapın</li>
<li>Yedekleme stratejisi oluşturun</li>
</ul>
    `;
  } else if (titleLower.includes('malware') || descLower.includes('malware')) {
    extendedContent = `
<h3>Malware Koruması</h3>
<p>Malware (zararlı yazılım) koruması için alınması gereken önlemler:</p>
<ul>
<li>Antivirus yazılımı kullanın</li>
<li>Güvenlik duvarı aktif edin</li>
<li>Bilinmeyen kaynaklardan dosya indirmeyin</li>
<li>Düzenli sistem taraması yapın</li>
</ul>
    `;
  } else {
    extendedContent = `
<h3>Siber Güvenlik Önerileri</h3>
<p>Bu tür siber güvenlik tehditlerine karşı genel korunma önlemleri:</p>
<ul>
<li>Güçlü şifreler kullanın</li>
<li>İki faktörlü kimlik doğrulama aktif edin</li>
<li>Düzenli güvenlik eğitimi alın</li>
<li>Güvenlik politikalarınızı güncel tutun</li>
<li>Olay müdahale planı hazırlayın</li>
</ul>
    `;
  }
  
  return extendedContent;
};
