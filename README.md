#️ Siber Güvenlik Eğitim Platformu

> Modern ve kapsamlı siber güvenlik eğitimi, güncel haberler ve pratik araçlar sunan interaktif platform.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Proje Amacı

Bu platform, siber güvenlik alanında **farkındalık yaratmak** ve **kapsamlı eğitim sunmak** amacıyla geliştirilmiştir. Güncel tehditler, güvenlik açıkları ve korunma yöntemleri hakkında bilgi sağlayarak kullanıcıların siber güvenlik bilgilerini artırmayı hedefler.

## �� Hedef Kitle

- ** Siber Güvenlik Uzmanları** - Güncel tehditleri takip etmek için
- ** BT Profesyonelleri** - Güvenlik bilgilerini güncellemek için  
- ** Öğrenciler** - Siber güvenlik öğrenmek için
- ** Eğitimciler** - Eğitim materyali olarak kullanmak için
- ** Genel Kullanıcılar** - Kişisel güvenlik farkındalığı için

## ✨ Özellikler

### 📰 **Dinamik Haber Sistemi**
- 15+ siber güvenlik RSS kaynağından otomatik haber çekme
- Kategori bazlı filtreleme (Tehditler, Güvenlik Açıkları, Eğitim)
- Gelişmiş arama ve son dakika haberleri
- Her haber için detaylı analiz ve öneriler

### 🎓 **Etkileşimli Eğitim Modülleri**
- Siber güvenlik temelleri ve ileri seviye konular
- Ransomware, phishing, malware analizi
- Pratik güvenlik araçları kullanımı
- Sertifika sistemi ve ilerleme takibi

### **Pratik Güvenlik Araçları**
- Güvenlik açığı tarama
- Güçlü şifre oluşturma
- Ağ güvenlik analizi
- Sistem güvenlik değerlendirmesi

### **Quiz ve Değerlendirme**
- Dinamik soru oluşturma sistemi
- Seviye bazlı testler (Başlangıç, Orta, İleri)
- Anlık geri bildirim ve detaylı açıklamalar
- Kullanıcı gelişim raporları

### 🔐 **Güvenlik ve Erişim Kontrolü**
- Firebase Authentication ile güvenli giriş
- Blur efekti ile içerik koruması
- Kullanıcı rolleri ve yetkilendirme
- Giriş yapmadan içerik önizleme

## 🛠️ Teknolojiler

### **Frontend**
- **React 18** - Modern UI framework
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Vite** - Hızlı build tool ve geliştirme sunucusu
- **React Router** - Sayfa yönlendirme
- **React Query** - Veri yönetimi ve cache

### **UI/UX**
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern ve erişilebilir UI bileşenleri
- **Radix UI** - Erişilebilir UI primitives
- **Lucide React** - Tutarlı ikon kütüphanesi

### **Backend & Veritabanı**
- **Firebase Firestore** - NoSQL veritabanı
- **Firebase Authentication** - Kullanıcı kimlik doğrulama
- **Firebase Storage** - Dosya depolama

### **Harici Servisler**
- **RSS Feeds** - 15+ siber güvenlik kaynağı
- **CORS Proxy** - Cross-origin istekler
- **NewsAPI** - Haber API entegrasyonu

## 🚀 Hızlı Başlangıç

### **Gereksinimler**
- Node.js 18+ 
- npm veya yarn
- Firebase projesi

### **Kurulum**

```bash
# 1. Projeyi klonlayın
git clone https://github.com/username/siberGuvenlik.git
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

### **Environment Değişkenleri**

`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📖 Kullanım

### **Haberler Sayfası**
- Güncel siber güvenlik haberlerini görüntüleyin
- Kategori bazlı filtreleme yapın
- Arama ile spesifik konuları bulun
- Haber detaylarını okuyun

### **Eğitim Modülleri**
- Siber güvenlik konularını öğrenin
- Pratik araçları kullanın
- İlerlemenizi takip edin
- Sertifika kazanın

### **Quiz Sistemi**
- Bilginizi test edin
- Farklı seviyelerde sorular çözün
- Detaylı geri bildirim alın
- Gelişiminizi izleyin

### **Güvenlik Araçları**
- IP sorgulama ve analiz
- Şifre güvenlik kontrolü
- Hash hesaplama ve doğrulama
- Ağ güvenlik taraması

## 🚀 Deployment

### **Vercel (Önerilen)**
```bash
npm i -g vercel
vercel
```

### **Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### **Firebase Hosting**
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📁 Proje Yapısı
