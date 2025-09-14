# 🛡️ Siber Güvenlik Platformu

Modern ve kapsamlı bir siber güvenlik eğitim ve bilgilendirme platformu. React, TypeScript ve Firebase ile geliştirilmiştir.

## 🚀 Özellikler

### 📰 Dinamik Haber Sistemi
- **RSS Entegrasyonu**: 15+ siber güvenlik RSS kaynağından otomatik haber çekme
- **Firebase Veritabanı**: Haberleri saklama ve yönetme
- **Akıllı Kategorilendirme**: Tehditler, güvenlik açıkları, eğitim, araçlar
- **Arama ve Filtreleme**: Gelişmiş arama ve kategori filtreleme
- **Son Dakika Haberleri**: Kritik güvenlik uyarıları
- **Detaylı İçerik**: Her haber için genişletilmiş açıklamalar ve öneriler

### 🎓 Eğitim Modülleri
- **Siber Güvenlik Temelleri**: Temel kavramlar ve prensipler
- **Tehdit Analizi**: Ransomware, phishing, malware analizi
- **Güvenlik Araçları**: Pratik araç kullanımı
- **Sertifika Sistemi**: Eğitim tamamlama sertifikaları

### 🧪 Etkileşimli Araçlar
- **Güvenlik Testleri**: Sistem güvenlik değerlendirmesi
- **Vulnerability Scanner**: Güvenlik açığı tarama
- **Password Generator**: Güçlü şifre oluşturma
- **Network Analyzer**: Ağ güvenlik analizi

### 📊 Quiz ve Değerlendirme
- **Dinamik Quiz Sistemi**: Otomatik soru oluşturma
- **Seviye Bazlı Testler**: Başlangıç, orta, ileri seviye
- **Anlık Geri Bildirim**: Detaylı açıklamalar ve öneriler
- **İlerleme Takibi**: Kullanıcı gelişim raporları

### 🔧 Yönetim Paneli
- **Admin Dashboard**: Haber ve içerik yönetimi
- **RSS Senkronizasyonu**: Otomatik haber güncelleme
- **Kullanıcı Yönetimi**: Kullanıcı rolleri ve yetkiler
- **Analitik Raporlar**: Platform kullanım istatistikleri

## 🛠️ Teknolojiler

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Tip güvenliği
- **Vite** - Hızlı build tool
- **React Router** - Sayfa yönlendirme
- **React Query** - Veri yönetimi ve cache

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI bileşenleri
- **Radix UI** - Erişilebilir UI primitives
- **Lucide React** - İkon kütüphanesi
- **Framer Motion** - Animasyonlar

### Backend & Veritabanı
- **Firebase Firestore** - NoSQL veritabanı
- **Firebase Authentication** - Kullanıcı kimlik doğrulama
- **Firebase Storage** - Dosya depolama

### Harici Servisler
- **RSS Feeds** - 15+ siber güvenlik kaynağı
- **CORS Proxy** - Cross-origin istekler
- **NewsAPI** - Haber API entegrasyonu

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Firebase projesi

### Adımlar

```bash
# 1. Projeyi klonlayın
git clone <repository-url>
cd siberGuvenlik

# 2. Bağımlılıkları yükleyin
npm install

# 3. Environment değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin ve Firebase ayarlarınızı ekleyin

# 4. Geliştirme sunucusunu başlatın
npm run dev

# 5. Tarayıcıda açın
# http://localhost:8080
```

### Environment Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment

### Vercel (Önerilen)
```bash
# Vercel CLI ile
npm i -g vercel
vercel

# Veya GitHub entegrasyonu ile
# GitHub repository'sini Vercel'e bağlayın
```

### Netlify
```bash
# Netlify CLI ile
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Firebase Hosting
```bash
# Firebase CLI ile
npm i -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── ui/             # shadcn/ui bileşenleri
│   ├── Header.tsx      # Ana başlık
│   ├── Footer.tsx      # Alt bilgi
│   └── AdminPanel.tsx  # Yönetim paneli
├── pages/              # Sayfa bileşenleri
│   ├── Home.tsx        # Ana sayfa
│   ├── News.tsx        # Haberler
│   ├── NewsDetail.tsx  # Haber detayı
│   ├── Training.tsx    # Eğitim
│   ├── Quiz.tsx        # Quiz
│   └── Tools.tsx       # Araçlar
├── services/           # API servisleri
│   ├── firebaseNewsService.ts  # Firebase haber servisi
│   ├── rssService.ts           # RSS servisi
│   └── newsService.ts          # Haber servisi
├── lib/                # Yardımcı kütüphaneler
│   ├── firebase.ts     # Firebase yapılandırması
│   └── utils.ts        # Yardımcı fonksiyonlar
└── hooks/              # Custom React hooks
```

## 🔧 Geliştirme

### Mevcut Komutlar
```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run preview      # Build önizleme
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
```

### Yeni Özellik Ekleme
1. `src/pages/` altında yeni sayfa oluşturun
2. `src/components/` altında bileşen ekleyin
3. `src/services/` altında API servisi yazın
4. `App.tsx`'de route ekleyin

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: [Adınız]
- **Email**: [email@example.com]
- **GitHub**: [github.com/username]

## 🙏 Teşekkürler

- [React](https://reactjs.org/) - UI framework
- [Firebase](https://firebase.google.com/) - Backend servisleri
- [shadcn/ui](https://ui.shadcn.com/) - UI bileşenleri
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - İkon kütüphanesi

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**