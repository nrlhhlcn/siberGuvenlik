import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Array karıştırma fonksiyonu (Fisher-Yates algoritması + timestamp)
export function shuffleArray<T>(array: T[]): T[] {
  // Undefined değerleri filtrele
  const validArray = array.filter(item => item !== undefined && item !== null);
  const shuffled = [...validArray];
  
  // Her seferinde farklı karıştırma için timestamp kullan
  const seed = Date.now() % 1000;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Daha iyi rastgelelik için seed kullan
    const randomValue = (Math.sin(seed + i) * 10000) % 1;
    const j = Math.floor(randomValue * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}
