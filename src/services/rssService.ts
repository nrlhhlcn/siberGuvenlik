import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase';

// CORS Proxy URL'si
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// RSS Feed kaynakları - Güncel Siber Güvenlik Haberleri
const RSS_FEEDS = [
  {
    name: 'Bleeping Computer Security',
    url: 'https://www.bleepingcomputer.com/feed/',
    category: 'threats',
    language: 'en'
  },
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'threats',
    language: 'en'
  },
  {
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    category: 'reports',
    language: 'en'
  },
  {
    name: 'Security Week',
    url: 'https://www.securityweek.com/rss',
    category: 'updates',
    language: 'en'
  },
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'tools',
    language: 'en'
  },
  {
    name: 'CISA News',
    url: 'https://www.cisa.gov/news.xml',
    category: 'updates',
    language: 'en'
  },
  {
    name: 'NIST Cybersecurity',
    url: 'https://www.nist.gov/news-events/cybersecurity-news/rss.xml',
    category: 'education',
    language: 'en'
  },
  {
    name: 'Threatpost',
    url: 'https://threatpost.com/feed/',
    category: 'threats',
    language: 'en'
  },
  {
    name: 'CSO Online',
    url: 'https://www.csoonline.com/index.rss',
    category: 'reports',
    language: 'en'
  },
  {
    name: 'InfoSec Magazine',
    url: 'https://www.infosecurity-magazine.com/rss/',
    category: 'education',
    language: 'en'
  }
];

export interface RSSNewsItem {
  id: string;
  title: string;
  content: string;
  link: string;
  pubDate: string;
  category: string;
  authorId: string;
  authorName: string;
  source: string;
  language: string;
  createdAt: any;
  severity?: string;
  image?: string;
}

// RSS feed'den haberleri çek
export const fetchRSSFeeds = async (): Promise<RSSNewsItem[]> => {
  const allNews: RSSNewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching RSS feed: ${feed.name}`);
      
      // CORS proxy ile RSS feed'i çek
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feed.url)}`);
      const xmlText = await response.text();
      
      // XML'i parse et
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // RSS item'larını bul
      const items = xmlDoc.querySelectorAll('item');
      
      items.forEach((item) => {
        const title = item.querySelector('title')?.textContent;
        const description = item.querySelector('description')?.textContent;
        const link = item.querySelector('link')?.textContent;
        const pubDate = item.querySelector('pubDate')?.textContent;
        
        if (title && description) {
          const newsItem: RSSNewsItem = {
            id: generateNewsId(link || title, title),
            title: title,
            content: description,
            link: link || '',
            pubDate: pubDate || new Date().toISOString(),
            category: feed.category,
            authorId: 'rss-bot',
            authorName: 'RSS Bot',
            source: feed.name,
            language: feed.language,
            createdAt: new Date(),
            severity: determineSeverity(title, description),
            image: extractImageFromContent(description)
          };
          
          allNews.push(newsItem);
        }
      });
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.name}:`, error);
    }
  }

  return allNews;
};

// Haber ID'si oluştur (stabil ID için)
const generateNewsId = (link: string, title: string): string => {
  try {
    const url = new URL(link);
    const domain = url.hostname.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
    const titleHash = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    
    // URL'den path'i de al
    const pathHash = url.pathname.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    
    return `${domain}-${pathHash}-${titleHash}`.toLowerCase();
  } catch (error) {
    // URL geçersizse sadece title'dan ID oluştur
    const titleHash = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30);
    return `news-${titleHash}`.toLowerCase();
  }
};

// Severity belirleme (başlık ve içeriğe göre)
const determineSeverity = (title: string, content: string): string => {
  const highRiskKeywords = ['critical', 'urgent', 'exploit', 'vulnerability', 'breach', 'attack', 'malware', 'ransomware'];
  const mediumRiskKeywords = ['update', 'patch', 'security', 'warning', 'alert'];
  
  const text = (title + ' ' + content).toLowerCase();
  
  if (highRiskKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  } else if (mediumRiskKeywords.some(keyword => text.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
};

// İçerikten resim URL'si çıkar
const extractImageFromContent = (content: string): string => {
  const imgRegex = /<img[^>]+src="([^"]+)"/i;
  const match = content.match(imgRegex);
  return match ? match[1] : '';
};

// RSS feed'lerden haberleri çek ve döndür (Firebase'e kaydetmeden)
export const getLatestNews = async (): Promise<RSSNewsItem[]> => {
  try {
    console.log('Fetching latest news from RSS feeds...');
    const newsItems = await fetchRSSFeeds();
    console.log(`Fetched ${newsItems.length} news items from RSS feeds.`);
    return newsItems;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};
