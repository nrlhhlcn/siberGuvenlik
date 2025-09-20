// Eğitim içerikleri verisi
export interface CourseContent {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'practice';
}

// Siber Güvenlik Temelleri Kursu
export const cyberSecurityBasics: CourseContent = {
  id: "cyber-basics",
  title: "Siber Güvenlik Temelleri",
  description: "Siber güvenliğin temel kavramları ve ilkeleri",
  level: "Başlangıç",
  duration: "4 saat",
  modules: [
    {
      id: "module-1",
      title: "Güvenlik Temelleri",
      description: "Güvenlik kavramları ve temel prensipler",
      duration: "1 saat",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Güvenlik Nedir?",
          content: `
<div class="space-y-8">
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
      <span class="text-2xl">🛡️</span>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Güvenlik Nedir?</h1>
    <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
      Güvenlik, bilgi ve sistemlerin korunması için alınan önlemlerin bütünüdür. 
      Dijital dünyada güvenlik, verilerin gizliliğini, bütünlüğünü ve erişilebilirliğini sağlamak anlamına gelir.
    </p>
  </div>

  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
    <h2 class="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6 flex items-center">
      <span class="text-3xl mr-3">🔐</span>
      Güvenliğin Üç Temel Prensibi (CIA Triad)
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mb-3">
            <span class="text-xl">🔒</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gizlilik</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Confidentiality</p>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Bilgilerin sadece yetkili kişiler tarafından erişilebilir olması
        </p>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <strong>Örnek:</strong> Şifreli e-posta, dosya şifreleme
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-3">
            <span class="text-xl">✅</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bütünlük</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Integrity</p>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Bilgilerin değiştirilmeden korunması
        </p>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <strong>Örnek:</strong> Veri doğrulama, hash kontrolü
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
            <span class="text-xl">⚡</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Erişilebilirlik</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Availability</p>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Bilgilerin ihtiyaç duyulduğunda erişilebilir olması
        </p>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <strong>Örnek:</strong> Yedekleme, yüksek erişilebilirlik
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
      <h3 class="text-xl font-bold text-red-900 dark:text-red-100 mb-4 flex items-center">
        <span class="text-2xl mr-3">⚠️</span>
        Güvenlik Tehditleri
      </h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">İç Tehditler</h4>
          <ul class="space-y-1 text-sm text-red-700 dark:text-red-300">
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Kötü niyetli çalışanlar</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Yanlışlıkla yapılan hatalar</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Eğitimsiz personel</li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">Dış Tehditler</h4>
          <ul class="space-y-1 text-sm text-red-700 dark:text-red-300">
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Siber saldırılar</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Malware (Kötü amaçlı yazılım)</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Phishing (Oltalama)</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>DDoS saldırıları</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
      <h3 class="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
        <span class="text-2xl mr-3">🛡️</span>
        Güvenlik Önlemleri
      </h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Teknik Önlemler</h4>
          <ul class="space-y-1 text-sm text-green-700 dark:text-green-300">
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Firewall (Güvenlik duvarı)</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Antivirus yazılımları</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Şifreleme</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>İki faktörlü kimlik doğrulama</li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Yönetimsel Önlemler</h4>
          <ul class="space-y-1 text-sm text-green-700 dark:text-green-300">
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Güvenlik politikaları</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Personel eğitimi</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Erişim kontrolü</li>
            <li class="flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Düzenli güvenlik denetimleri</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
    <h3 class="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
      <span class="text-3xl mr-3">🎯</span>
      Temel Güvenlik Kuralları
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div class="text-center">
          <div class="text-2xl mb-2">🔑</div>
          <h4 class="font-semibold text-sm">Güçlü Şifreler</h4>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div class="text-center">
          <div class="text-2xl mb-2">📧</div>
          <h4 class="font-semibold text-sm">Şüpheli E-postalar</h4>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div class="text-center">
          <div class="text-2xl mb-2">🔄</div>
          <h4 class="font-semibold text-sm">Güncellemeler</h4>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div class="text-center">
          <div class="text-2xl mb-2">💾</div>
          <h4 class="font-semibold text-sm">Yedekleme</h4>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div class="text-center">
          <div class="text-2xl mb-2">🔥</div>
          <h4 class="font-semibold text-sm">Güvenlik Duvarı</h4>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
    <div class="text-4xl mb-4">🎓</div>
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Sonuç</h3>
    <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
      Güvenlik, sürekli bir süreçtir ve herkesin sorumluluğudur. 
      Temel güvenlik prensiplerini anlamak, dijital dünyada güvende olmanın ilk adımıdır.
    </p>
  </div>
</div>
          `,
          duration: "15 dakika",
          type: "text"
        },
        {
          id: "lesson-1-2",
          title: "Tehdit Türleri",
          content: `
# Tehdit Türleri

Siber güvenlik tehditleri, sistemlere ve verilere zarar verme potansiyeli olan her türlü riski kapsar.

## Malware (Kötü Amaçlı Yazılım)

### Virüs
- Kendini kopyalayan kötü amaçlı kod
- Dosyalara bulaşır ve yayılır
- Örnek: ILOVEYOU, Melissa

### Solucan (Worm)
- Ağ üzerinden yayılan bağımsız program
- Virüsten farklı olarak konak dosyaya ihtiyaç duymaz
- Örnek: WannaCry, Conficker

### Truva Atı (Trojan)
- Yararlı gibi görünen zararlı yazılım
- Kullanıcı tarafından bilinçli olarak yüklenir
- Örnek: Backdoor, Keylogger

### Ransomware
- Verileri şifreleyip fidye isteyen yazılım
- Son yıllarda en tehlikeli tehdit türü
- Örnek: WannaCry, Ryuk, LockBit

## Ağ Saldırıları

### DDoS (Distributed Denial of Service)
- Hizmeti geçici olarak durdurmak için yapılan saldırı
- Çok sayıda cihazdan aynı anda istek gönderilir
- Hedef: Web siteleri, sunucular

### Man-in-the-Middle (MitM)
- İletişimi dinleyen ve manipüle eden saldırı
- Ağ trafiğini yakalar ve değiştirir
- Örnek: WiFi ağlarında dinleme

### SQL Injection
- Veritabanı sorgularını manipüle eden saldırı
- Web uygulamalarında yaygın
- Veri sızıntısına neden olabilir

## Sosyal Mühendislik

### Phishing
- Sahte e-postalar ve web siteleri
- Kişisel bilgileri çalmak için
- Örnek: Sahte banka e-postaları

### Vishing (Voice Phishing)
- Telefon üzerinden yapılan aldatma
- Sahte teknik destek çağrıları
- Örnek: "Bilgisayarınızda virüs var" çağrıları

### Pretexting
- Sahte kimlik kullanarak bilgi toplama
- Güven oluşturup bilgi sızdırma
- Örnek: Sahte müşteri temsilcisi

## Fiziksel Tehditler

### Veri Merkezi Saldırıları
- Fiziksel erişim sağlama
- Donanım manipülasyonu
- Örnek: USB cihazları bırakma

### Dumpster Diving
- Çöplerden bilgi toplama
- Kağıt belgeler, CD'ler
- Örnek: Şifre notları, organizasyon şemaları

## İç Tehditler

### Kötü Niyetli İç Tehditler
- Çalışanların kasıtlı zarar vermesi
- Veri çalma, sistem bozma
- Örnek: İstifa eden çalışanın veri silmesi

### Yanlışlıkla İç Tehditler
- Bilinçsiz hatalar
- Eğitimsizlikten kaynaklanan hatalar
- Örnek: Yanlış e-posta gönderme

## Tehdit Değerlendirmesi

### Risk = Tehdit × Zayıflık × Etki

- **Tehdit**: Saldırının gerçekleşme olasılığı
- **Zayıflık**: Sistemdeki güvenlik açığı
- **Etki**: Saldırının neden olacağı zarar

### Tehdit Seviyeleri
1. **Düşük**: Az zarar, düşük olasılık
2. **Orta**: Orta zarar, orta olasılık
3. **Yüksek**: Yüksek zarar, yüksek olasılık
4. **Kritik**: Çok yüksek zarar, yüksek olasılık

## Korunma Yöntemleri

### Teknik Korunma
- Antivirus yazılımları
- Firewall konfigürasyonu
- Düzenli güncellemeler
- Şifreleme

### Eğitim ve Farkındalık
- Personel eğitimi
- Güvenlik politikaları
- Düzenli testler
- Simülasyonlar

### Fiziksel Korunma
- Erişim kontrolü
- Güvenlik kameraları
- Çevre güvenliği
- Veri imha prosedürleri

## Sonuç

Tehdit türlerini anlamak, etkili güvenlik önlemleri almanın temelidir. Her tehdit türü için farklı korunma stratejileri geliştirmek gerekir.
          `,
          duration: "20 dakika",
          type: "text"
        },
        {
          id: "lesson-1-3",
          title: "Risk Değerlendirmesi",
          content: `
# Risk Değerlendirmesi

Risk değerlendirmesi, güvenlik tehditlerini analiz etme ve uygun önlemleri belirleme sürecidir.

## Risk Nedir?

Risk, bir tehdidin gerçekleşme olasılığı ile neden olacağı zararın çarpımıdır.

### Risk = Olasılık × Etki

## Risk Değerlendirme Süreci

### 1. Varlık Envanteri
- Sistemdeki tüm varlıkları listeleme
- Donanım, yazılım, veri, personel
- Her varlığın değerini belirleme

### 2. Tehdit Analizi
- Potansiyel tehditleri belirleme
- Tehdit kaynaklarını analiz etme
- Tehdit türlerini kategorize etme

### 3. Zayıflık Analizi
- Sistemdeki güvenlik açıklarını tespit etme
- Zayıflık türlerini belirleme
- Zayıflıkların ciddiyetini değerlendirme

### 4. Risk Hesaplama
- Her tehdit-zayıflık kombinasyonu için risk hesaplama
- Risk seviyelerini belirleme
- Risk matrisi oluşturma

### 5. Risk Yönetimi
- Yüksek riskleri önceliklendirme
- Uygun önlemleri belirleme
- Risk azaltma stratejileri geliştirme

## Risk Matrisi

| Olasılık/Etki | Düşük | Orta | Yüksek | Kritik |
|---------------|-------|------|--------|--------|
| **Düşük** | Düşük | Düşük | Orta | Yüksek |
| **Orta** | Düşük | Orta | Yüksek | Kritik |
| **Yüksek** | Orta | Yüksek | Kritik | Kritik |
| **Kritik** | Yüksek | Kritik | Kritik | Kritik |

## Risk Seviyeleri

### Düşük Risk
- Kabul edilebilir seviye
- Rutin izleme yeterli
- Örnek: Eski yazılım güncellemesi

### Orta Risk
- Dikkatli izleme gerekli
- Zamanında müdahale önemli
- Örnek: Güvenlik duvarı konfigürasyonu

### Yüksek Risk
- Acil müdahale gerekli
- Öncelikli çözüm gerekli
- Örnek: Kritik güvenlik açığı

### Kritik Risk
- Anında müdahale gerekli
- Sistem kapatılabilir
- Örnek: Aktif saldırı

## Risk Azaltma Stratejileri

### 1. Risk Kabul Etme
- Düşük riskler için
- Maliyet-fayda analizi
- Kabul edilebilir seviye

### 2. Risk Azaltma
- Güvenlik önlemleri alma
- Zayıflıkları giderme
- Tehditleri engelleme

### 3. Risk Transferi
- Sigorta yaptırma
- Üçüncü taraf hizmetleri
- Risk paylaşımı

### 4. Risk Kaçınma
- Riskli aktivitelerden kaçınma
- Alternatif çözümler
- Sistem değişikliği

## Risk Değerlendirme Araçları

### Kalitatif Yöntemler
- Uzman görüşü
- Beyin fırtınası
- Anketler
- Mülakatlar

### Kantitatif Yöntemler
- İstatistiksel analiz
- Matematiksel modeller
- Simülasyonlar
- Monte Carlo analizi

## Risk Değerlendirme Raporu

### 1. Executive Summary
- Ana bulgular
- Kritik riskler
- Öneriler

### 2. Metodoloji
- Kullanılan yöntemler
- Veri kaynakları
- Sınırlamalar

### 3. Bulgular
- Tespit edilen riskler
- Risk seviyeleri
- Etkilenen varlıklar

### 4. Öneriler
- Risk azaltma önlemleri
- Uygulama planı
- Maliyet analizi

### 5. İzleme
- Düzenli gözden geçirme
- Güncelleme sıklığı
- Sorumluluklar

## Risk İzleme ve Gözden Geçirme

### Düzenli İzleme
- Aylık risk raporları
- Yeni tehditlerin takibi
- Güvenlik önlemlerinin etkinliği

### Yıllık Gözden Geçirme
- Kapsamlı risk analizi
- Strateji güncellemesi
- Bütçe planlaması

### Acil Durum Değerlendirmesi
- Yeni tehditler ortaya çıktığında
- Güvenlik olayları sonrası
- Sistem değişiklikleri sonrası

## Risk Yönetimi Best Practices

### 1. Üst Yönetim Desteği
- Risk yönetimine öncelik verme
- Yeterli kaynak ayırma
- Sorumlulukları belirleme

### 2. Ekip Çalışması
- Çok disiplinli ekip
- Düzenli toplantılar
- Bilgi paylaşımı

### 3. Dokümantasyon
- Tüm süreçleri kaydetme
- Değişiklikleri takip etme
- Deneyimleri paylaşma

### 4. Sürekli İyileştirme
- Süreçleri gözden geçirme
- Yeni yöntemler deneme
- Eğitim ve gelişim

## Sonuç

Risk değerlendirmesi, güvenlik yönetiminin temel taşıdır. Düzenli ve sistematik risk değerlendirmesi yaparak, güvenlik tehditlerine karşı etkili önlemler alabiliriz.
          `,
          duration: "25 dakika",
          type: "text"
        }
      ]
    },
    {
      id: "module-2",
      title: "Güvenlik Politikaları",
      description: "Güvenlik politikaları ve prosedürleri",
      duration: "1 saat",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Güvenlik Politikası Oluşturma",
          content: `
# Güvenlik Politikası Oluşturma

Güvenlik politikaları, organizasyonun güvenlik yaklaşımını ve kurallarını tanımlayan resmi belgelerdir.

## Güvenlik Politikası Nedir?

Güvenlik politikası, bir organizasyonun bilgi güvenliği konusundaki yaklaşımını, hedeflerini ve kurallarını tanımlayan yazılı belgedir.

### Amaçları
- Güvenlik standartlarını belirleme
- Sorumlulukları tanımlama
- Yasal uyumluluğu sağlama
- Risk yönetimini destekleme

## Politika Türleri

### 1. Master Security Policy
- Genel güvenlik yaklaşımı
- Üst düzey prensipler
- Organizasyon genelinde geçerli

### 2. Specific Security Policies
- Belirli konulara odaklanan
- Detaylı kurallar
- Örnek: E-posta güvenliği politikası

### 3. Technical Policies
- Teknik uygulamalar
- Sistem konfigürasyonları
- Örnek: Firewall politikası

## Politika Geliştirme Süreci

### 1. Hazırlık Aşaması
- Mevcut durumu analiz etme
- Yasal gereklilikleri belirleme
- Paydaşları belirleme
- Kaynakları planlama

### 2. Geliştirme Aşaması
- İçerik oluşturma
- Paydaşlarla görüşme
- Uzman görüşü alma
- Taslak hazırlama

### 3. Onay Aşaması
- Yasal inceleme
- Üst yönetim onayı
- Paydaş onayı
- Resmi yayın

### 4. Uygulama Aşaması
- Personel eğitimi
- Sistem konfigürasyonu
- İzleme ve kontrol
- Sürekli güncelleme

## Politika İçeriği

### 1. Giriş
- Politikanın amacı
- Kapsamı
- Tanımlar
- Sorumluluklar

### 2. Güvenlik Hedefleri
- CIA Triad (Gizlilik, Bütünlük, Erişilebilirlik)
- Yasal uyumluluk
- İş sürekliliği
- Risk yönetimi

### 3. Güvenlik Kuralları
- Erişim kontrolü
- Veri koruma
- Ağ güvenliği
- Olay müdahale

### 4. Uygulama
- Roller ve sorumluluklar
- Eğitim gereksinimleri
- İzleme ve raporlama
- Uyumsuzluk yönetimi

## Temel Güvenlik Politikaları

### 1. Erişim Kontrol Politikası
- Kimlik doğrulama
- Yetkilendirme
- Hesap yönetimi
- Parola politikaları

### 2. Veri Koruma Politikası
- Veri sınıflandırması
- Şifreleme
- Yedekleme
- Veri imha

### 3. Ağ Güvenliği Politikası
- Firewall kuralları
- VPN kullanımı
- Kablosuz ağ güvenliği
- Ağ segmentasyonu

### 4. Olay Müdahale Politikası
- Olay tanımları
- Müdahale süreçleri
- Sorumluluklar
- Raporlama

## Politika Uygulama

### 1. Eğitim ve Farkındalık
- Personel eğitimi
- Güvenlik farkındalığı
- Düzenli hatırlatmalar
- Test ve simülasyonlar

### 2. Teknik Kontroller
- Sistem konfigürasyonu
- Otomatik kontroller
- İzleme ve loglama
- Uyumsuzluk tespiti

### 3. Yönetimsel Kontroller
- Düzenli denetimler
- Politika gözden geçirme
- Uyumsuzluk yönetimi
- Sürekli iyileştirme

## Politika Yönetimi

### 1. Versiyon Kontrolü
- Değişiklik takibi
- Onay süreçleri
- Yayın yönetimi
- Arşivleme

### 2. Gözden Geçirme
- Düzenli güncellemeler
- Yasal değişiklikler
- Teknoloji değişiklikleri
- İş süreç değişiklikleri

### 3. İletişim
- Politika yayını
- Değişiklik bildirimleri
- Eğitim materyalleri
- Sık sorulan sorular

## Politika Etkinliği

### 1. Metrikler
- Uyumluluk oranları
- Olay sayıları
- Eğitim tamamlama oranları
- Politika farkındalığı

### 2. Değerlendirme
- Düzenli gözden geçirme
- Paydaş geri bildirimleri
- Dış denetimler
- Benchmarking

### 3. İyileştirme
- Sürekli güncelleme
- En iyi uygulamalar
- Teknoloji entegrasyonu
- Süreç optimizasyonu

## Yasal ve Düzenleyici Uyumluluk

### 1. Yasal Gereklilikler
- KVKK (Kişisel Verilerin Korunması)
- SOX (Sarbanes-Oxley)
- HIPAA (Sağlık Bilgileri)
- PCI DSS (Ödeme Kartları)

### 2. Standartlar
- ISO 27001
- NIST Framework
- COBIT
- ITIL

### 3. Uyumluluk Yönetimi
- Gereklilik analizi
- Uyumluluk değerlendirmesi
- Düzeltici eylemler
- Raporlama

## Sonuç

Güvenlik politikaları, organizasyonel güvenliğin temelini oluşturur. Etkili politikalar, güvenlik risklerini azaltır ve yasal uyumluluğu sağlar.
          `,
          duration: "30 dakika",
          type: "text"
        }
      ]
    }
  ]
};

// Diğer kurs içerikleri de buraya eklenebilir
export const courseContents: CourseContent[] = [
  cyberSecurityBasics
];
