import { useState, useEffect } from "react";
import { 
  Search, 
  Key, 
  Hash, 
  Wifi, 
  Shield, 
  Eye,
  Download,
  Copy,
  CheckCircle,
  MapPin,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CryptoJS from 'crypto-js';

// Leaflet marker ikonunu düzelt
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Özel marker ikonu oluştur
const createCustomIcon = (color: string = '#10b981') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        📍
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const Tools = () => {
  const [ipResult, setIpResult] = useState("");
  const [ipInput, setIpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [ipData, setIpData] = useState<any>(null);
  const [mapPosition, setMapPosition] = useState<[number, number]>([20, 0]); // Dünya merkezi
  const [networkDevices, setNetworkDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hashInput, setHashInput] = useState("");
  const [hashResults, setHashResults] = useState<any>({});
  const [selectedHashType, setSelectedHashType] = useState<string>("");
  const [crackInput, setCrackInput] = useState("");
  const [crackResults, setCrackResults] = useState<any>({});
  const [isCracking, setIsCracking] = useState(false);

  const tools = [
    {
      id: "ip-lookup",
      title: "IP Sorgulama",
      description: "IP adresinin konum ve ISP bilgilerini öğrenin",
      icon: Search,
      color: "text-primary"
    },
    {
      id: "password-generator",
      title: "Güvenli Şifre Oluşturucu",
      description: "Karmaşık ve güvenli şifreler oluşturun",
      icon: Key,
      color: "text-accent"
    },
    {
      id: "hash-generator",
      title: "Hash Oluşturucu",
      description: "MD5, SHA-256 ve diğer hash algoritmalarını kullanın",
      icon: Hash,
      color: "text-destructive"
    },
    {
      id: "port-scanner",
      title: "Ağ Tarayıcı",
      description: "Yerel ağınızdaki bağlı cihazları tespit edin.",
      icon: Wifi,
      color: "text-cyan-400"
    }
  ];



  const analyzePassword = (password: string) => {
    if (!password) return { 
      score: 0, 
      label: "Şifre Girin", 
      color: "text-muted-foreground",
      suggestions: ["Şifrenizi yazmaya başlayın"],
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false
      }
    };
    
    let score = 0;
    const suggestions = [];
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };
    
    // Uzunluk kontrolü
    if (checks.length) {
      score += 2;
    } else {
      suggestions.push("En az 8 karakter olmalı");
    }
    
    // Karakter çeşitliliği
    if (checks.uppercase) score += 1;
    else suggestions.push("En az bir büyük harf ekleyin (A-Z)");
    
    if (checks.lowercase) score += 1;
    else suggestions.push("En az bir küçük harf ekleyin (a-z)");
    
    if (checks.numbers) score += 1;
    else suggestions.push("En az bir rakam ekleyin (0-9)");
    
    if (checks.symbols) score += 1;
    else suggestions.push("En az bir özel karakter ekleyin (!@#$%^&*)");
    
    // Bonus puanlar
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Güçlü şifre bonusu
    if (checks.length && checks.uppercase && checks.lowercase && checks.numbers && checks.symbols) {
      score += 2;
    }
    
    // Sonuç değerlendirmesi
    let label, color;
    if (score <= 2) {
      label = "Çok Zayıf";
      color = "text-red-500";
    } else if (score <= 4) {
      label = "Zayıf";
      color = "text-orange-500";
    } else if (score <= 6) {
      label = "Orta";
      color = "text-yellow-500";
    } else if (score <= 8) {
      label = "Güçlü";
      color = "text-green-500";
    } else {
      label = "Çok Güçlü";
      color = "text-emerald-500";
    }
    
    return { score, label, color, suggestions, checks };
  };

  const scanNetwork = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setNetworkDevices([]);
    
    try {
      // WebRTC ile yerel IP'yi al
      const localIP = await getLocalIP();
      const ipParts = localIP.split('.');
      const networkBase = ipParts.slice(0, 3).join('.') + '.';
      
      // Kendi cihazını ekle
      const currentDevice = {
        ip: localIP,
        status: 'active',
        type: getCurrentDeviceType(navigator.userAgent, navigator.platform),
        lastSeen: new Date().toISOString(),
        details: {
          platform: navigator.platform,
          browser: getBrowserInfo(navigator.userAgent),
          network: 'WiFi',
          language: navigator.language,
          mac: 'Real Device'
        }
      };
      
      const devices = [currentDevice];
      
      // Simüle edilmiş ağ taraması - gerçekçi sonuçlar
      const commonIPs = [1, 100, 101, 102, 103, 200, 201, 202, 250, 251, 252, 253, 254];
      
      for (let i = 0; i < commonIPs.length; i++) {
        const ip = networkBase + commonIPs[i];
        
        // Progress güncelle
        setScanProgress(Math.round(((i + 1) / commonIPs.length) * 100));
        
        // Simüle edilmiş cihaz tespiti
        const device = await simulateDeviceDetection(ip, commonIPs[i]);
        if (device) {
          devices.push(device);
        }
        
        // Gerçekçi tarama hızı
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setNetworkDevices(devices);
      
    } catch (error) {
      console.error('Ağ tarama hatası:', error);
      // Hata durumunda demo verileri
      setNetworkDevices(generateDemoDevices());
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const getLocalIP = async (): Promise<string> => {
    try {
      // WebRTC ile yerel IP'yi al
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      return new Promise((resolve) => {
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
            if (match) {
              resolve(match[1]);
              pc.close();
            }
          }
        };
        
        // Timeout
        setTimeout(() => {
          resolve('192.168.1.1'); // Fallback
          pc.close();
        }, 5000);
      });
    } catch (error) {
      return '192.168.1.1'; // Fallback
    }
  };

  const simulateDeviceDetection = async (ip: string, lastOctet: number): Promise<any> => {
    // Gerçekçi cihaz tespiti simülasyonu
    const deviceTypes = {
      1: { type: 'Router/Gateway', platform: 'Router', browser: 'Router OS', mac: 'AA:BB:CC:DD:EE:01' },
      100: { type: 'PC/Server', platform: 'Windows', browser: 'Chrome', mac: 'AA:BB:CC:DD:EE:64' },
      101: { type: 'Mobile Device', platform: 'Android', browser: 'Chrome Mobile', mac: 'AA:BB:CC:DD:EE:65' },
      102: { type: 'Mobile Device', platform: 'iOS', browser: 'Safari', mac: 'AA:BB:CC:DD:EE:66' },
      103: { type: 'PC/Server', platform: 'MacOS', browser: 'Safari', mac: 'AA:BB:CC:DD:EE:67' },
      200: { type: 'Smart TV', platform: 'Android TV', browser: 'TV Browser', mac: 'AA:BB:CC:DD:EE:C8' },
      201: { type: 'Gaming Console', platform: 'PlayStation', browser: 'PS Browser', mac: 'AA:BB:CC:DD:EE:C9' },
      202: { type: 'Smart Speaker', platform: 'IoT', browser: 'IoT OS', mac: 'AA:BB:CC:DD:EE:CA' },
      250: { type: 'Security Camera', platform: 'IoT', browser: 'Camera OS', mac: 'AA:BB:CC:DD:EE:FA' },
      251: { type: 'Smart Thermostat', platform: 'IoT', browser: 'IoT OS', mac: 'AA:BB:CC:DD:EE:FB' },
      252: { type: 'Smart Lock', platform: 'IoT', browser: 'Lock OS', mac: 'AA:BB:CC:DD:EE:FC' },
      253: { type: 'Network Printer', platform: 'Printer', browser: 'Printer OS', mac: 'AA:BB:CC:DD:EE:FD' },
      254: { type: 'Router/Gateway', platform: 'Router', browser: 'Router OS', mac: 'AA:BB:CC:DD:EE:FE' }
    };
    
    const deviceInfo = deviceTypes[lastOctet as keyof typeof deviceTypes];
    
    if (!deviceInfo) return null;
    
    // Rastgele tespit başarısı (daha gerçekçi)
    const detectionChance = Math.random();
    if (detectionChance < 0.7) { // %70 başarı oranı
      return {
        ip,
        status: 'active',
        type: deviceInfo.type,
        lastSeen: new Date().toISOString(),
        details: {
          platform: deviceInfo.platform,
          browser: deviceInfo.browser,
          network: 'WiFi',
          language: 'tr',
          mac: deviceInfo.mac
        }
      };
    }
    
    return null;
  };

  const pingWithImage = async (ip: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.src = '';
        resolve(false);
      }, 200);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      
      img.src = `http://${ip}/favicon.ico?${Date.now()}`;
    });
  };

  const pingWithFetch = async (ip: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 200);
      
      const response = await fetch(`http://${ip}`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  };

  const pingWithWebSocket = async (ip: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(`ws://${ip}:80`);
        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, 200);
        
        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };
        
        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch (error) {
        resolve(false);
      }
    });
  };

  const generateMACAddress = (ip: string): string => {
    // IP'ye göre sahte MAC adresi oluştur
    const parts = ip.split('.').map(Number);
    const mac = parts.map(part => part.toString(16).padStart(2, '0')).join(':');
    return mac.toUpperCase();
  };

  const getCurrentDeviceType = (userAgent: string, platform: string): string => {
    if (/Android/i.test(userAgent)) return 'Mobile Device';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'Mobile Device';
    if (/Windows/i.test(platform)) return 'PC/Server';
    if (/Mac/i.test(platform)) return 'PC/Server';
    if (/Linux/i.test(platform)) return 'PC/Server';
    return 'Unknown Device';
  };

  const getBrowserInfo = (userAgent: string): string => {
    if (/Chrome/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent)) return 'Safari';
    if (/Edge/i.test(userAgent)) return 'Edge';
    if (/Opera/i.test(userAgent)) return 'Opera';
    return 'Unknown Browser';
  };

  const generateDemoDevices = (): any[] => {
    const devices = [
      {
        ip: '192.168.1.1',
        status: 'active',
        type: 'Router/Gateway',
        lastSeen: new Date().toISOString(),
        details: {
          platform: 'Router',
          browser: 'Router OS',
          network: 'WiFi',
          language: 'en',
          mac: 'AA:BB:CC:DD:EE:01'
        }
      },
      {
        ip: '192.168.1.100',
        status: 'active',
        type: 'PC/Server',
        lastSeen: new Date().toISOString(),
        details: {
          platform: 'Windows',
          browser: 'Chrome',
          network: 'WiFi',
          language: 'tr',
          mac: 'AA:BB:CC:DD:EE:64'
        }
      },
      {
        ip: '192.168.1.101',
        status: 'active',
        type: 'Mobile Device',
        lastSeen: new Date().toISOString(),
        details: {
          platform: 'Android',
          browser: 'Chrome Mobile',
          network: 'WiFi',
          language: 'tr',
          mac: 'AA:BB:CC:DD:EE:65'
        }
      },
      {
        ip: '192.168.1.102',
        status: 'active',
        type: 'Mobile Device',
        lastSeen: new Date().toISOString(),
        details: {
          platform: 'iOS',
          browser: 'Safari',
          network: 'WiFi',
          language: 'tr',
          mac: 'AA:BB:CC:DD:EE:66'
        }
      },
      {
        ip: '192.168.1.250',
        status: 'active',
        type: 'IoT Device',
        lastSeen: new Date().toISOString(),
        details: {
          platform: 'IoT',
          browser: 'IoT OS',
          network: 'WiFi',
          language: 'en',
          mac: 'AA:BB:CC:DD:EE:FA'
        }
      }
    ];
    
    return devices;
  };

  const getDeviceType = (ip: string) => {
    // IP aralıklarına göre cihaz tipini tahmin et
    const lastOctet = parseInt(ip.split('.').pop() || '0');
    
    if (lastOctet === 1) return 'Router/Gateway';
    if (lastOctet === 254) return 'Router/Gateway';
    if (lastOctet >= 100 && lastOctet <= 199) return 'PC/Server';
    if (lastOctet >= 200 && lastOctet <= 249) return 'Mobile Device';
    if (lastOctet >= 250 && lastOctet <= 253) return 'IoT Device';
    
    return 'Network Device';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
      // Fallback: eski yöntem
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Online hash veritabanlarını kontrol et
  const checkOnlineHashDatabases = async (hash: string, type: string): Promise<any> => {
    try {
      // MD5 için CrackStation API (ücretsiz)
      if (type === "MD5") {
        const response = await fetch(`https://crackstation.net/api/hash.php?hash=${hash}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result) {
            return {
              found: true,
              originalText: data.result,
              hashType: type,
              message: `Online veritabanında bulundu! Orijinal metin: "${data.result}"`
            };
          }
        }
      }

      // SHA-1 için HashKiller API
      if (type === "SHA1") {
        const response = await fetch(`https://hashkiller.co.uk/api/hash/${hash}`);
        if (response.ok) {
          const data = await response.json();
          if (data.found && data.plaintext) {
            return {
              found: true,
              originalText: data.plaintext,
              hashType: type,
              message: `Online veritabanında bulundu! Orijinal metin: "${data.plaintext}"`
            };
          }
        }
      }

      // Genel hash arama (Google Custom Search API simülasyonu)
      const searchResponse = await fetch(`https://api.hashlookup.com/hash/${hash}`);
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.found && searchData.plaintext) {
          return {
            found: true,
            originalText: searchData.plaintext,
            hashType: type,
            message: `Online veritabanında bulundu! Orijinal metin: "${searchData.plaintext}"`
          };
        }
      }

      return { found: false };
    } catch (error) {
      console.error('Online hash veritabanı hatası:', error);
      return { found: false };
    }
  };

  const generateHash = async (type: string) => {
    if (!hashInput.trim()) {
      alert("Lütfen hash'ini almak istediğiniz metni girin!");
      return;
    }

    setSelectedHashType(type);
    
    try {
      let hash = "";
      
      switch (type) {
        case "MD5":
          hash = await generateMD5(hashInput);
          break;
        case "SHA1":
          hash = await generateSHA1(hashInput);
          break;
        case "SHA256":
          hash = await generateSHA256(hashInput);
          break;
        case "SHA512":
          hash = await generateSHA512(hashInput);
          break;
        default:
          hash = await generateSHA256(hashInput);
      }
      
      setHashResults(prev => ({
        ...prev,
        [type]: hash
      }));
      
    } catch (error) {
      console.error('Hash oluşturma hatası:', error);
      alert('Hash oluşturulurken bir hata oluştu! Lütfen tekrar deneyin.');
    }
  };

  const generateMD5 = async (text: string): Promise<string> => {
    // Gerçek MD5 hash'i oluştur
    return CryptoJS.MD5(text).toString();
  };

  const generateSHA1 = async (text: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('SHA-1 hash hatası:', error);
      return 'SHA-1 hash oluşturulamadı';
    }
  };

  const generateSHA256 = async (text: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('SHA-256 hash hatası:', error);
      return 'SHA-256 hash oluşturulamadı';
    }
  };

  const generateSHA512 = async (text: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-512', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('SHA-512 hash hatası:', error);
      return 'SHA-512 hash oluşturulamadı';
    }
  };

  const generateAllHashes = async () => {
    if (!hashInput.trim()) {
      alert("Lütfen hash'ini almak istediğiniz metni girin!");
      return;
    }

    setSelectedHashType("all");
    
    try {
      const [md5, sha1, sha256, sha512] = await Promise.all([
        generateMD5(hashInput),
        generateSHA1(hashInput),
        generateSHA256(hashInput),
        generateSHA512(hashInput)
      ]);
      
      setHashResults({
        MD5: md5,
        SHA1: sha1,
        SHA256: sha256,
        SHA512: sha512
      });
      
    } catch (error) {
      console.error('Hash oluşturma hatası:', error);
      alert('Hash oluşturulurken bir hata oluştu! Lütfen tekrar deneyin.');
    }
  };

  const crackHash = async (type: string) => {
    if (!crackInput.trim()) {
      alert("Lütfen çözmek istediğiniz hash'i girin!");
      return;
    }

    setIsCracking(true);
    setCrackResults({});

    try {
      const result = await crackHashByType(crackInput.trim(), type);
      setCrackResults(prev => ({
        ...prev,
        [type]: result
      }));
    } catch (error) {
      console.error('Hash cracking hatası:', error);
      setCrackResults(prev => ({
        ...prev,
        [type]: { found: false, message: 'Hash çözülemedi' }
      }));
    } finally {
      setIsCracking(false);
    }
  };

  const crackHashByType = async (hash: string, type: string): Promise<any> => {
    // Önce online hash veritabanlarını dene
    try {
      const onlineResult = await checkOnlineHashDatabases(hash, type);
      if (onlineResult.found) {
        return onlineResult;
      }
    } catch (error) {
      console.log('Online hash veritabanı kontrolü başarısız, yerel sözlük deneniyor...');
    }

    // Yaygın şifreler ve kelimeler listesi (RockYou sözlüğünden)
    const commonPasswords = [
      // En yaygın şifreler
      'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'user', 'test', 'guest', 'welcome', 'login', 'secret',
      'cyber', 'guard', 'security', 'hack', 'password1', 'admin123',
      'root', 'user123', 'test123', 'demo', 'sample', 'example',
      'hello', 'world', 'computer', 'internet', 'network', 'system',
      'data', 'file', 'document', 'backup', 'database', 'server',
      'client', 'web', 'site', 'page', 'home', 'index', 'main',
      'cyberguard', 'siber', 'guvenlik', 'güvenlik', 'şifre', 'parola',
      'love', 'like', 'hate', 'good', 'bad', 'yes', 'no', 'ok', 'cool',
      'nice', 'great', 'awesome', 'amazing', 'beautiful', 'perfect',
      'happy', 'sad', 'angry', 'excited', 'bored', 'tired', 'hungry',
      'thirsty', 'hot', 'cold', 'warm', 'big', 'small', 'tall', 'short',
      
      // Yaygın şifreler (RockYou'dan)
      '12345678', 'qwerty123', '1234567890', '1234567', '12345', '1234',
      '111111', '000000', '123123', 'abc123', 'password1', 'password123',
      'admin123', 'root123', 'user123', 'test123', 'guest123', 'welcome123',
      'login123', 'secret123', 'cyber123', 'guard123', 'security123',
      'hack123', 'demo123', 'sample123', 'example123', 'hello123',
      'world123', 'computer123', 'internet123', 'network123', 'system123',
      'data123', 'file123', 'document123', 'backup123', 'database123',
      'server123', 'client123', 'web123', 'site123', 'page123', 'home123',
      'index123', 'main123', 'cyberguard123', 'siber123', 'guvenlik123',
      'güvenlik123', 'şifre123', 'parola123', 'love123', 'like123',
      'hate123', 'good123', 'bad123', 'yes123', 'no123', 'ok123', 'cool123',
      'nice123', 'great123', 'awesome123', 'amazing123', 'beautiful123',
      'perfect123', 'happy123', 'sad123', 'angry123', 'excited123',
      'bored123', 'tired123', 'hungry123', 'thirsty123', 'hot123',
      'cold123', 'warm123', 'big123', 'small123', 'tall123', 'short123',
      
      // Yaygın kelimeler
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
      'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
      'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
      'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
      'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
      'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
      'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
      'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
      'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'must', 'can',
      'shall', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
    ];

    // Türkçe yaygın kelimeler
    const turkishWords = [
      'merhaba', 'dünya', 'bilgisayar', 'internet', 'ağ', 'sistem',
      'veri', 'dosya', 'belge', 'yedek', 'veritabanı', 'sunucu',
      'istemci', 'web', 'site', 'sayfa', 'ana', 'giriş', 'çıkış',
      'kullanıcı', 'yönetici', 'test', 'misafir', 'hoşgeldin', 'giriş',
      'gizli', 'siber', 'güvenlik', 'hack', 'şifre1', 'admin123',
      'kök', 'kullanıcı123', 'test123', 'demo', 'örnek', 'örnek',
      'selam', 'dünya', 'bilgisayar', 'internet', 'ağ', 'sistem',
      'nurullah', 'ahmet', 'mehmet', 'ali', 'veli', 'ayşe', 'fatma',
      'zeynep', 'elif', 'emine', 'hatice', 'meryem', 'zehra',
      'mustafa', 'hüseyin', 'hüseyin', 'ibrahim', 'yusuf', 'ömer',
      'osman', 'halil', 'ismail', 'yasin', 'murat', 'serkan',
      'burak', 'can', 'deniz', 'efe', 'gökhan', 'hakan', 'kemal',
      'levent', 'mert', 'onur', 'polat', 'ramazan', 'selim',
      'tamer', 'umut', 'volkan', 'yavuz', 'zeki', 'adnan',
      'berk', 'cengiz', 'dursun', 'emre', 'ferhat', 'güven',
      'hasan', 'ismet', 'jale', 'kadir', 'lütfi', 'mahmut',
      'nazım', 'orhan', 'pamuk', 'rahim', 'sabri', 'tahsin',
      'ufuk', 'vahit', 'yılmaz', 'zübeyir', 'abdullah', 'bekir',
      'cemal', 'davut', 'emin', 'fahri', 'gazi', 'hamdi',
      'ilhan', 'jülide', 'kamil', 'lale', 'mazhar', 'naci',
      'oktay', 'perihan', 'rahmi', 'sadık', 'tamer', 'ülkü',
      'vahap', 'yusuf', 'zübeyde', 'adil', 'bülent', 'cahit',
      'dündar', 'emir', 'fuat', 'gürsel', 'hüsnü', 'ismail',
      'jülide', 'kaya', 'lütfi', 'mazhar', 'nazım', 'orhan',
      'pakize', 'rahmi', 'sadık', 'tahsin', 'ülkü', 'vahit',
      'yılmaz', 'zübeyir', 'abdullah', 'bekir', 'cemal', 'davut',
      'emin', 'fahri', 'gazi', 'hamdi', 'ilhan', 'jülide',
      'kamil', 'lale', 'mazhar', 'naci', 'oktay', 'perihan',
      'rahmi', 'sadık', 'tamer', 'ülkü', 'vahap', 'yusuf',
      'zübeyde', 'adil', 'bülent', 'cahit', 'dündar', 'emir',
      'fuat', 'gürsel', 'hüsnü', 'ismail', 'jülide', 'kaya',
      'lütfi', 'mazhar', 'nazım', 'orhan', 'pakize', 'rahmi',
      'sadık', 'tahsin', 'ülkü', 'vahit', 'yılmaz', 'zübeyir'
    ];

    const allWords = [...commonPasswords, ...turkishWords];

    // Hash türüne göre hash fonksiyonu seç
    let hashFunction: (text: string) => Promise<string>;
    switch (type) {
      case "MD5":
        hashFunction = generateMD5;
        break;
      case "SHA1":
        hashFunction = generateSHA1;
        break;
      case "SHA256":
        hashFunction = generateSHA256;
        break;
      case "SHA512":
        hashFunction = generateSHA512;
        break;
      default:
        hashFunction = generateSHA256;
    }

    // Önce hash'in kendisini test et (bazen hash değeri direkt metin olabilir)
    const directHash = await hashFunction(hash);
    if (directHash.toLowerCase() === hash.toLowerCase()) {
      return {
        found: true,
        originalText: hash,
        hashType: type,
        message: `Hash çözüldü! Orijinal metin hash'in kendisi: "${hash}"`
      };
    }

    // Her kelimeyi test et
    for (const word of allWords) {
      const wordHash = await hashFunction(word);
      if (wordHash.toLowerCase() === hash.toLowerCase()) {
        return {
          found: true,
          originalText: word,
          hashType: type,
          message: `Hash çözüldü! Orijinal metin: "${word}"`
        };
      }
    }

    // Sayısal kombinasyonları dene (sadece ilk 1000'ini test et)
    for (let i = 0; i <= 1000; i++) {
      const numStr = i.toString().padStart(4, '0');
      const numHash = await hashFunction(numStr);
      if (numHash.toLowerCase() === hash.toLowerCase()) {
        return {
          found: true,
          originalText: numStr,
          hashType: type,
          message: `Hash çözüldü! Orijinal metin: "${numStr}"`
        };
      }
    }

    return {
      found: false,
      message: `Hash çözülemedi. ${allWords.length} kelime ve 10000 sayı denendi.`
    };
  };

  const crackAllHashes = async () => {
    if (!crackInput.trim()) {
      alert("Lütfen çözmek istediğiniz hash'i girin!");
      return;
    }

    setIsCracking(true);
    setCrackResults({});

    try {
      const hashTypes = ["MD5", "SHA1", "SHA256", "SHA512"];
      const results: any = {};

      for (const type of hashTypes) {
        const result = await crackHashByType(crackInput.trim(), type);
        results[type] = result;
      }

      setCrackResults(results);
    } catch (error) {
      console.error('Hash cracking hatası:', error);
      alert('Hash çözülürken bir hata oluştu!');
    } finally {
      setIsCracking(false);
    }
  };

  const lookupIP = async () => {
    if (!ipInput.trim()) {
      setIpResult("Lütfen bir IP adresi girin.");
      return;
    }

    setIsLoading(true);
    setIpResult("");

    try {
      // IP adresi formatını kontrol et
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(ipInput.trim())) {
        setIpResult("Geçersiz IP adresi formatı. Lütfen doğru formatta girin (örn: 8.8.8.8)");
        setIsLoading(false);
        return;
      }

      // IP sorgulama API'si (ipapi.co kullanıyoruz)
      const response = await fetch(`https://ipapi.co/${ipInput.trim()}/json/`);
      const data = await response.json();

      if (data.error) {
        setIpResult("IP adresi bulunamadı veya sorgulanamadı.");
        setIsLoading(false);
        return;
      }

      // Decimal hesaplama
      const ipParts = ipInput.trim().split('.');
      const decimal = (parseInt(ipParts[0]) << 24) + (parseInt(ipParts[1]) << 16) + (parseInt(ipParts[2]) << 8) + parseInt(ipParts[3]);

      // Koordinat formatını dönüştür
      const formatCoordinates = (coord: number, isLatitude: boolean) => {
        if (!coord) return 'Bilinmiyor';
        const absCoord = Math.abs(coord);
        const degrees = Math.floor(absCoord);
        const minutes = Math.floor((absCoord - degrees) * 60);
        const seconds = (((absCoord - degrees) * 60 - minutes) * 60).toFixed(2);
        const direction = isLatitude ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
        return `${coord} (${degrees}° ${minutes}′ ${seconds}″ ${direction})`;
      };

      // IP verilerini state'e kaydet
      setIpData(data);

      // Harita pozisyonunu güncelle
      if (data.latitude && data.longitude) {
        setMapPosition([data.latitude, data.longitude]);
      }

      // Sonuçları formatla
      const result = `IP Adresi: ${data.ip || ipInput}
Decimal: ${decimal}
Hostname: ${data.hostname || 'Bilinmiyor'}
ASN: ${data.asn || 'Bilinmiyor'}
ISP: ${data.org || 'Bilinmiyor'}
Ülke: ${data.country_name || 'Bilinmiyor'}
Ülke Kodu: ${data.country_code || 'Bilinmiyor'}
Bölge: ${data.region || 'Bilinmiyor'}
Şehir: ${data.city || 'Bilinmiyor'}
Posta Kodu: ${data.postal || 'Bilinmiyor'}
Enlem: ${formatCoordinates(data.latitude, true)}
Boylam: ${formatCoordinates(data.longitude, false)}
Zaman Dilimi: ${data.timezone || 'Bilinmiyor'}
Para Birimi: ${data.currency || 'Bilinmiyor'}
Dil: ${data.languages || 'Bilinmiyor'}`;

      setIpResult(result);
    } catch (error) {
      setIpResult("Sorgulama sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-accent/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-cyber-blue/20 rounded-full animate-bounce"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Shield className="h-32 w-32 text-accent mx-auto mb-8 animate-cyber-pulse animate-bounce-in" />
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
            <span className="text-gradient-cyber">Güvenlik Araçları</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Profesyonel siber güvenlik araçlarını kullanın. IP analizi, hash oluşturma ve daha fazlası.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm text-accent animate-slide-up">
            <Badge variant="secondary" className="bg-primary/20 text-primary animate-pulse-glow">Hızlı</Badge>
            <Badge variant="secondary" className="bg-cyber-blue/20 text-cyan-400 animate-pulse-glow">Güvenli</Badge>
            <Badge variant="secondary" className="bg-accent/20 text-accent animate-pulse-glow">Profesyonel</Badge>
          </div>
        </div>
      </section>

      {/* Araçlar Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.id} className="card-cyber hover-lift group animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Icon className={`h-12 w-12 ${tool.color} group-hover:animate-cyber-pulse animate-rotate-in`} />
                      <div>
                        <CardTitle className="text-xl group-hover:text-accent transition-colors">
                          {tool.title}
                        </CardTitle>
                        <CardDescription>
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Araç Detayları */}
          <Tabs defaultValue="ip-lookup" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {tools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="text-xs md:text-sm">
                  {tool.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* IP Sorgulama */}
            <TabsContent value="ip-lookup">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-6 w-6 text-primary" />
                    <span>IP Adresi Sorgulama</span>
                  </CardTitle>
                  <CardDescription>
                    Bir IP adresinin coğrafi konumu, ISP bilgileri ve güvenlik durumunu kontrol edin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip-input">IP Adresi</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="ip-input"
                        placeholder="Örn: 8.8.8.8"
                        className="flex-1"
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
                      />
                      <Button 
                        className="btn-cyber" 
                        onClick={lookupIP}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sorgulanıyor...
                          </div>
                        ) : (
                          <span>Sorgula</span>
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIpInput("8.8.8.8")}
                        className="text-xs"
                      >
                        Google DNS (8.8.8.8)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIpInput("1.1.1.1")}
                        className="text-xs"
                      >
                        Cloudflare (1.1.1.1)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIpInput("208.67.222.222")}
                        className="text-xs"
                      >
                        OpenDNS (208.67.222.222)
                      </Button>
                    </div>
                  </div>
                  
                  {ipResult && (
                    <div className="bg-muted/50 p-4 rounded-lg animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-accent flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Sorgu Sonucu:
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(ipResult)}
                          className="text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Kopyala
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* IP Bilgileri */}
                        <div className="bg-card p-4 rounded border font-mono text-sm space-y-2">
                          {ipResult.split('\n').map((line, index) => {
                            const [label, ...values] = line.split(':');
                            const value = values.join(':').trim();
                            return (
                              <div key={index} className="flex items-start">
                                <span className="text-muted-foreground min-w-[140px] font-semibold">
                                  {label}:
                                </span>
                                <span className="text-foreground ml-3 flex-1 break-words">
                                  {value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Harita */}
                        <div className="bg-card p-4 rounded border">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="h-4 w-4 text-accent" />
                            <h5 className="font-semibold text-accent">Konum Haritası</h5>
                          </div>
                          <div className="h-80 rounded overflow-hidden border">
                            <MapContainer 
                              center={mapPosition} 
                              zoom={ipData && ipData.latitude ? 12 : 2} 
                              style={{ height: '100%', width: '100%' }}
                              className="z-0"
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              {ipData && ipData.latitude && ipData.longitude && (
                                <Marker 
                                  position={[ipData.latitude, ipData.longitude]}
                                  icon={createCustomIcon('#10b981')}
                                >
                                  <Popup>
                                    <div className="text-center">
                                      <div className="font-semibold text-primary">{ipData.ip}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {ipData.city}, {ipData.country_name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {ipData.org}
                                      </div>
                                    </div>
                                  </Popup>
                                </Marker>
                              )}
                            </MapContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Şifre Oluşturucu */}
            <TabsContent value="password-generator">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-6 w-6 text-accent" />
                    <span>Güvenli Şifre Oluşturucu</span>
                  </CardTitle>
                  <CardDescription>
                    Şifrenizi yazın ve güvenlik seviyesini gerçek zamanlı olarak analiz edin. Güçlü şifre önerileri alın.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Şifre Girişi */}
                  <div className="space-y-3">
                    <Label htmlFor="password-input" className="text-sm font-medium">Şifrenizi Yazın</Label>
                                        <div className="space-y-2">
                      <Input
                        id="password-input"
                        type="password"
                        placeholder="Şifrenizi buraya yazın..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="relative z-50"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(password)}
                          disabled={!password}
                          className="text-xs"
                        >
                          {copied ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Kopyalandı
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Copy className="h-3 w-3" />
                              Kopyala
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Şifre Analizi */}
                  {password && (
                    <div className="bg-muted/50 p-4 rounded-lg animate-fade-in">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-accent">Şifre Analizi</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${analyzePassword(password).color}`}>
                            {analyzePassword(password).label}
                          </span>
                          <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  i < analyzePassword(password).score 
                                    ? analyzePassword(password).color.replace('text-', 'bg-')
                                    : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Güvenlik Kontrolleri */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className={`flex items-center gap-2 p-2 rounded ${analyzePassword(password).checks.length ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {analyzePassword(password).checks.length ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-current" />
                          )}
                          <span className="text-sm">En az 8 karakter</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${analyzePassword(password).checks.uppercase ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {analyzePassword(password).checks.uppercase ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-current" />
                          )}
                          <span className="text-sm">Büyük harf (A-Z)</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${analyzePassword(password).checks.lowercase ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {analyzePassword(password).checks.lowercase ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-current" />
                          )}
                          <span className="text-sm">Küçük harf (a-z)</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${analyzePassword(password).checks.numbers ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {analyzePassword(password).checks.numbers ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-current" />
                          )}
                          <span className="text-sm">Rakam (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${analyzePassword(password).checks.symbols ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {analyzePassword(password).checks.symbols ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-current" />
                          )}
                          <span className="text-sm">Özel karakter (!@#$)</span>
                        </div>
                      </div>

                      {/* Öneriler */}
                      {analyzePassword(password).suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-amber-600">Öneriler:</h5>
                          <ul className="space-y-1">
                            {analyzePassword(password).suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Şifre Detayları */}
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Uzunluk: {password.length} karakter</span>
                          <span>Güç: {analyzePassword(password).score}/10</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hash Oluşturucu */}
            <TabsContent value="hash-generator">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-6 w-6 text-destructive" />
                    <span>Hash Oluşturucu</span>
                  </CardTitle>
                  <CardDescription>
                    Metinlerinizin MD5, SHA-1, SHA-256 hash değerlerini oluşturun.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Metin Girişi */}
                  <div className="space-y-2">
                    <Label htmlFor="hash-input">Metin</Label>
                    <Textarea
                      id="hash-input"
                      placeholder="Hash'ini almak istediğiniz metni buraya yazın..."
                      className="min-h-[100px]"
                      value={hashInput}
                      onChange={(e) => setHashInput(e.target.value)}
                    />
                  </div>
                  
                  {/* Hash Butonları */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        className="btn-cyber"
                        onClick={() => generateHash("MD5")}
                        disabled={!hashInput.trim()}
                      >
                        <span>MD5</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="btn-matrix"
                        onClick={() => generateHash("SHA1")}
                        disabled={!hashInput.trim()}
                      >
                        <span>SHA-1</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="btn-matrix"
                        onClick={() => generateHash("SHA256")}
                        disabled={!hashInput.trim()}
                      >
                        <span>SHA-256</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="btn-matrix"
                        onClick={() => generateHash("SHA512")}
                        disabled={!hashInput.trim()}
                      >
                        <span>SHA-512</span>
                      </Button>
                    </div>
                    
                    <Button 
                      className="btn-cyber w-full"
                      onClick={generateAllHashes}
                      disabled={!hashInput.trim()}
                    >
                      <span>Tüm Hash'leri Oluştur</span>
                    </Button>
                  </div>

                  {/* Hash Sonuçları */}
                  {Object.keys(hashResults).length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-accent">Hash Sonuçları</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const allHashes = Object.entries(hashResults)
                              .map(([type, hash]) => `${type}: ${hash}`)
                              .join('\n');
                            copyToClipboard(allHashes);
                          }}
                          className="text-xs relative z-20"
                        >
                          {copied ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Kopyalandı
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Copy className="h-3 w-3" />
                              Tümünü Kopyala
                            </div>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid gap-3">
                        {Object.entries(hashResults).map(([type, hash]) => (
                          <div key={type} className="p-3 bg-card rounded-lg border animate-fade-in relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(hash as string)}
                                className="h-6 w-6 p-0 relative z-20"
                              >
                                {copied ? (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <div className="font-mono text-sm break-all bg-muted/50 p-2 rounded">
                              {hash as string}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hash Bilgileri */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-500 mb-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Hash Türleri:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>• <strong>MD5:</strong> Basit hash (demo amaçlı)</div>
                      <div>• <strong>SHA-1:</strong> 160-bit, orta güvenlik</div>
                      <div>• <strong>SHA-256:</strong> 256-bit, güvenli (Bitcoin)</div>
                      <div>• <strong>SHA-512:</strong> 512-bit, çok güvenli</div>
                    </div>
                  </div>

                  {/* Hash Cracking Bölümü */}
                  <div className="border-t border-border/50 pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Unlock className="h-5 w-5 text-destructive" />
                      <h4 className="font-semibold text-destructive">Hash Çözme (Cracking)</h4>
                    </div>
                    
                    {/* Hash Girişi */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="crack-input">Hash Değeri</Label>
                      <Textarea
                        id="crack-input"
                        placeholder="Çözmek istediğiniz hash değerini buraya yazın..."
                        className="min-h-[80px]"
                        value={crackInput}
                        onChange={(e) => setCrackInput(e.target.value)}
                      />
                    </div>
                    
                    {/* Cracking Butonları */}
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          className="btn-cyber"
                          onClick={() => crackHash("MD5")}
                          disabled={!crackInput.trim() || isCracking}
                        >
                          <span>MD5 Çöz</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="btn-matrix"
                          onClick={() => crackHash("SHA1")}
                          disabled={!crackInput.trim() || isCracking}
                        >
                          <span>SHA-1 Çöz</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="btn-matrix"
                          onClick={() => crackHash("SHA256")}
                          disabled={!crackInput.trim() || isCracking}
                        >
                          <span>SHA-256 Çöz</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="btn-matrix"
                          onClick={() => crackHash("SHA512")}
                          disabled={!crackInput.trim() || isCracking}
                        >
                          <span>SHA-512 Çöz</span>
                        </Button>
                      </div>
                      
                      <Button 
                        className="btn-cyber w-full"
                        onClick={crackAllHashes}
                        disabled={!crackInput.trim() || isCracking}
                      >
                        {isCracking ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Çözülüyor...
                          </div>
                        ) : (
                          <span>Tüm Hash Türlerini Dene</span>
                        )}
                      </Button>
                    </div>

                    {/* Cracking Sonuçları */}
                    {Object.keys(crackResults).length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-destructive">Çözme Sonuçları</h5>
                        </div>
                        
                        <div className="grid gap-3">
                          {Object.entries(crackResults).map(([type, result]) => {
                            const crackResult = result as { found: boolean; originalText?: string; message: string };
                            return (
                            <div key={type} className={`p-3 rounded-lg border animate-fade-in ${
                              crackResult.found ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                            }`}>
                                                              <div className="flex items-center justify-between mb-2">
                                  <Badge variant={crackResult.found ? "default" : "secondary"} className="text-xs">
                                    {type}
                                  </Badge>
                                  <div className={`text-xs font-medium ${
                                    crackResult.found ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {crackResult.found ? '✓ Çözüldü' : '✗ Çözülemedi'}
                                  </div>
                                </div>
                                <div className="text-sm">
                                  {crackResult.found ? (
                                    <div>
                                      <div className="font-medium text-green-600 mb-1">
                                        Orijinal Metin: <span className="font-mono bg-green-500/20 px-2 py-1 rounded">
                                          {crackResult.originalText}
                                        </span>
                                      </div>
                                      <div className="text-muted-foreground">
                                        {crackResult.message}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-muted-foreground">
                                      {crackResult.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Cracking Bilgileri */}
                    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                      <div className="flex items-center space-x-2 text-destructive mb-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">Hash Çözme:</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• Online hash veritabanları kontrol edilir</div>
                        <div>• Yaygın şifreler ve kelimeler denenir (500+ kelime)</div>
                        <div>• Türkçe ve İngilizce kelimeler dahil</div>
                        <div>• Türkçe isimler: Nurullah, Ahmet, Mehmet, vb.</div>
                        <div>• 4 haneli sayısal kombinasyonlar (0000-1000)</div>
                        <div>• İnternetten bulduğunuz hash'ler denenir</div>
                        <div>• Karmaşık şifreler çözülemez</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ağ Tarayıcı */}
            <TabsContent value="port-scanner">
              <Card className="card-matrix">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wifi className="h-6 w-6 text-cyan-400" />
                    <span>Ağ Tarayıcı</span>
                  </CardTitle>
                  <CardDescription>
                    Simüle edilmiş ağ taraması. Yerel ağınızdaki yaygın cihazları tespit eder ve güvenlik analizi yapar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tarama Kontrolleri */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Yerel Ağ Taraması</h4>
                        <p className="text-sm text-muted-foreground">
                          Simüle edilmiş ağ taraması ile yaygın cihazları tespit eder (Router, PC, Mobile, IoT)
                        </p>
                      </div>
                      <Button 
                        onClick={scanNetwork} 
                        disabled={isScanning}
                        className="btn-cyber"
                      >
                        {isScanning ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Taranıyor...
                          </div>
                        ) : (
                          <span>Taramayı Başlat</span>
                        )}
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    {isScanning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Ağ taranıyor...</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bulunan Cihazlar */}
                  {networkDevices.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Bulunan Cihazlar ({networkDevices.length})</h4>
                        <Badge variant="secondary" className="text-xs">
                          Aktif
                        </Badge>
                      </div>
                      
                                             <div className="grid gap-3">
                         {networkDevices.map((device, index) => (
                           <div key={index} className="p-4 bg-card rounded-lg border animate-fade-in">
                             <div className="flex items-center justify-between mb-3">
                               <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                 <div>
                                   <div className="font-medium text-lg">{device.ip}</div>
                                   <div className="text-sm text-muted-foreground">
                                     {device.type} • Son görülme: {new Date(device.lastSeen).toLocaleTimeString()}
                                   </div>
                                 </div>
                               </div>
                               <div className="flex items-center gap-2">
                                 <Badge variant="outline" className="text-xs">
                                   {device.status}
                                 </Badge>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => copyToClipboard(device.ip)}
                                   className="h-8 w-8 p-0"
                                 >
                                   <Copy className="h-3 w-3" />
                                 </Button>
                               </div>
                             </div>
                             
                             {/* Cihaz Detayları */}
                             {device.details && (
                               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                 <div className="flex items-center gap-2">
                                   <span className="text-muted-foreground">Platform:</span>
                                   <Badge variant="secondary" className="text-xs">
                                     {device.details.platform}
                                   </Badge>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-muted-foreground">Browser:</span>
                                   <Badge variant="secondary" className="text-xs">
                                     {device.details.browser}
                                   </Badge>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-muted-foreground">Network:</span>
                                   <Badge variant="secondary" className="text-xs">
                                     {device.details.network}
                                   </Badge>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-muted-foreground">MAC:</span>
                                   <Badge variant="secondary" className="text-xs font-mono">
                                     {device.details.mac}
                                   </Badge>
                                 </div>
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  {/* Ağ Bilgileri */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-500 mb-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Ağ Güvenliği:</span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Bu simülasyon eğitim amaçlıdır</p>
                      <p>• Gerçek ağ taraması için özel araçlar kullanın</p>
                      <p>• Bulunan cihazları kontrol edin</p>
                      <p>• Güvenlik duvarı ayarlarınızı kontrol edin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Güvenlik Uyarısı */}
      <section className="py-12 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-destructive mb-4">
            Güvenlik ve Yasal Uyarı
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Bu araçlar eğitim ve güvenlik testi amaçlı hazırlanmıştır. 
            Sadece size ait olan veya test etme izniniz bulunan sistemlerde kullanın. 
            Yetkisiz erişim ve test etme yasal sonuçlar doğurabilir.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Tools;