import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos em milissegundos

  constructor() { }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = new Date().getTime();
    if (now > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const timestamp = new Date().getTime() + ttl;
    this.cache.set(key, { data, timestamp });
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
} 