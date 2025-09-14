import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchRSSNews, RSSNewsItem } from './rssService';

export interface NewsItem {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
  authorId: string;
  authorName: string;
  viewCount: number;
  isPublished: boolean;
}

// RSS haberlerini Firebase'e otomatik ekle
export const syncRSSNewsToFirebase = async (): Promise<number> => {
  try {
    console.log('RSS haberleri Firebase\'e senkronize ediliyor...');
    
    // RSS'den haberleri çek
    const rssNews = await fetchRSSNews();
    let addedCount = 0;
    
    for (const rssItem of rssNews) {
      try {
        // Aynı URL'de haber var mı kontrol et
        const existingQuery = query(
          collection(db, 'news'),
          where('url', '==', rssItem.url)
        );
        const existingSnapshot = await getDocs(existingQuery);
        
        if (existingSnapshot.empty) {
          // Yeni haber ekle
          const newsData = {
            title: rssItem.title,
            summary: rssItem.summary,
            content: rssItem.content,
            category: rssItem.category,
            severity: rssItem.severity,
            source: rssItem.source,
            image: rssItem.image,
            url: rssItem.url,
            publishedAt: Timestamp.fromDate(new Date(rssItem.publishedAt)),
            tags: rssItem.tags,
            isBreaking: rssItem.isBreaking,
            isPublished: true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            authorId: 'rss-bot',
            authorName: 'RSS Bot',
            viewCount: 0,
            feedName: rssItem.feedName,
            language: rssItem.language
          };
          
          await addDoc(collection(db, 'news'), newsData);
          addedCount++;
          console.log(`Yeni haber eklendi: ${rssItem.title}`);
        }
      } catch (error) {
        console.error(`Haber ekleme hatası: ${rssItem.title}`, error);
      }
    }
    
    console.log(`${addedCount} yeni RSS haberi Firebase'e eklendi`);
    return addedCount;
  } catch (error) {
    console.error('RSS senkronizasyon hatası:', error);
    return 0;
  }
};

// Haberleri getir (sayfalama ile) - RSS + Firebase karışımı
export const fetchNews = async (
  category?: string, 
  search?: string, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = 10
): Promise<{ news: NewsItem[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    // Basit query kullan (index gerektirmez)
    let q = query(
      collection(db, 'news'),
      where('isPublished', '==', true),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    const news: NewsItem[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      news.push({
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        timeAgo: formatTimeAgo(data.createdAt?.toDate?.() || new Date()),
        readTime: calculateReadTime(data.content || ''),
      } as NewsItem);
    });

    // Client-side sıralama (createdAt'e göre)
    news.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime; // En yeni önce
    });

    // Kategori filtresi (client-side)
    let filteredNews = news;
    if (category && category !== 'all') {
      filteredNews = news.filter(newsItem => newsItem.category === category);
    }

    // Eğer Firebase'de yeterli haber yoksa RSS'den çek
    if (filteredNews.length < pageSize) {
      console.log('Firebase\'de yeterli haber yok, RSS\'den çekiliyor...');
      try {
        const rssNews = await fetchRSSNews();
        const rssNewsFormatted = rssNews.slice(0, pageSize - filteredNews.length).map(rssItem => ({
          id: rssItem.id,
          title: rssItem.title,
          summary: rssItem.summary,
          content: rssItem.content,
          category: rssItem.category,
          severity: rssItem.severity,
          timeAgo: rssItem.timeAgo,
          readTime: rssItem.readTime,
          source: rssItem.source,
          image: rssItem.image,
          url: rssItem.url,
          publishedAt: rssItem.publishedAt,
          tags: rssItem.tags,
          isBreaking: rssItem.isBreaking,
          createdAt: new Date(rssItem.publishedAt),
          updatedAt: new Date(rssItem.publishedAt),
          authorId: 'rss-bot',
          authorName: 'RSS Bot',
          viewCount: 0,
          isPublished: true
        }));
        
        filteredNews.push(...rssNewsFormatted);
      } catch (error) {
        console.error('RSS haber çekme hatası:', error);
      }
    }

    // Arama filtresi (client-side)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNews = filteredNews.filter(newsItem => 
        newsItem.title.toLowerCase().includes(searchLower) ||
        newsItem.summary.toLowerCase().includes(searchLower) ||
        newsItem.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return {
      news: filteredNews,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Firebase haber çekme hatası:', error);
    // Hata durumunda RSS'den çek
    try {
      const rssNews = await fetchRSSNews();
      const rssNewsFormatted = rssNews.slice(0, pageSize).map(rssItem => ({
        id: rssItem.id,
        title: rssItem.title,
        summary: rssItem.summary,
        content: rssItem.content,
        category: rssItem.category,
        severity: rssItem.severity,
        timeAgo: rssItem.timeAgo,
        readTime: rssItem.readTime,
        source: rssItem.source,
        image: rssItem.image,
        url: rssItem.url,
        publishedAt: rssItem.publishedAt,
        tags: rssItem.tags,
        isBreaking: rssItem.isBreaking,
        createdAt: new Date(rssItem.publishedAt),
        updatedAt: new Date(rssItem.publishedAt),
        authorId: 'rss-bot',
        authorName: 'RSS Bot',
        viewCount: 0,
        isPublished: true
      }));
      
      return { news: rssNewsFormatted, lastDoc: null };
    } catch (rssError) {
      console.error('RSS fallback hatası:', rssError);
      return { news: [], lastDoc: null };
    }
  }
};

// Tek haber getir
export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    // Önce Firebase'den dene
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        timeAgo: formatTimeAgo(data.createdAt?.toDate?.() || new Date()),
        readTime: calculateReadTime(data.content || ''),
      } as NewsItem;
    }
  } catch (error) {
    console.error('Firebase haber detay hatası:', error);
  }

  // Firebase'de bulunamazsa RSS'den ara
  try {
    const rssNews = await fetchRSSNews();
    const foundNews = rssNews.find(news => news.id === id);
    
    if (foundNews) {
      // RSS haberini NewsItem formatına çevir
      return {
        id: foundNews.id,
        title: foundNews.title,
        summary: foundNews.summary,
        content: foundNews.content,
        category: foundNews.category,
        severity: foundNews.severity,
        timeAgo: foundNews.timeAgo,
        readTime: foundNews.readTime,
        source: foundNews.source,
        image: foundNews.image,
        url: foundNews.url,
        publishedAt: foundNews.publishedAt,
        tags: foundNews.tags,
        isBreaking: foundNews.isBreaking,
        createdAt: new Date(foundNews.publishedAt),
        updatedAt: new Date(foundNews.publishedAt),
        authorId: 'rss-bot',
        authorName: 'RSS Bot',
        viewCount: 0,
        isPublished: true
      };
    }
  } catch (error) {
    console.error('RSS haber detay hatası:', error);
  }

  return null;
};

// Son dakika haberleri getir
export const fetchBreakingNews = async (): Promise<NewsItem[]> => {
  try {
    // Basit query kullan (index gerektirmez)
    const q = query(
      collection(db, 'news'),
      where('isPublished', '==', true),
      limit(20) // Daha fazla haber çek
    );

    const snapshot = await getDocs(q);
    const news: NewsItem[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      news.push({
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        timeAgo: formatTimeAgo(data.createdAt?.toDate?.() || new Date()),
        readTime: calculateReadTime(data.content || ''),
      } as NewsItem);
    });

    // Client-side filtreleme (isBreaking)
    const breakingNews = news
      .filter(newsItem => newsItem.isBreaking)
      .sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return bTime - aTime; // En yeni önce
      })
      .slice(0, 5); // İlk 5'i al

    return breakingNews;
  } catch (error) {
    console.error('Firebase son dakika haber hatası:', error);
    // Hata durumunda RSS'den çek
    try {
      const rssNews = await fetchRSSNews();
      return rssNews
        .filter(newsItem => newsItem.isBreaking)
        .slice(0, 5);
    } catch (rssError) {
      console.error('RSS breaking news hatası:', rssError);
      return [];
    }
  }
};

// Kategori sayılarını getir
export const getNewsCounts = async (): Promise<Record<string, number>> => {
  try {
    const categories = ['all', 'threats', 'updates', 'tools', 'education', 'reports'];
    const counts: Record<string, number> = {};

    for (const category of categories) {
      let q = query(
        collection(db, 'news'),
        where('isPublished', '==', true)
      );

      if (category !== 'all') {
        q = query(q, where('category', '==', category));
      }

      const snapshot = await getDocs(q);
      counts[category] = snapshot.size;
    }

    return counts;
  } catch (error) {
    console.error('Firebase kategori sayı hatası:', error);
    return { all: 0, threats: 0, updates: 0, tools: 0, education: 0, reports: 0 };
  }
};

// Yeni haber ekle (Admin)
export const addNews = async (newsData: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'timeAgo' | 'readTime' | 'viewCount'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'news'), {
      ...newsData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      viewCount: 0,
      publishedAt: newsData.publishedAt ? Timestamp.fromDate(new Date(newsData.publishedAt)) : Timestamp.now()
    });

    return docRef.id;
  } catch (error) {
    console.error('Firebase haber ekleme hatası:', error);
    return null;
  }
};

// Haber güncelle (Admin)
export const updateNews = async (id: string, newsData: Partial<NewsItem>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'news', id);
    await updateDoc(docRef, {
      ...newsData,
      updatedAt: Timestamp.now()
    });

    return true;
  } catch (error) {
    console.error('Firebase haber güncelleme hatası:', error);
    return false;
  }
};

// Haber sil (Admin)
export const deleteNews = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'news', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Firebase haber silme hatası:', error);
    return false;
  }
};

// Görüntülenme sayısını artır
export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentCount = docSnap.data().viewCount || 0;
      await updateDoc(docRef, {
        viewCount: currentCount + 1
      });
    }
  } catch (error) {
    console.error('Firebase görüntülenme sayısı artırma hatası:', error);
  }
};

// Yardımcı fonksiyonlar
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
