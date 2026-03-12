export interface WeatherData {
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number | null;
  windKph: number | null;
}

/**
 * Cache interface for weather data. Implementations must be async
 * so they're drop-in compatible with DynamoDB (Phase 6E) and other
 * remote stores without changing call sites.
 */
export interface WeatherCacheInterface {
  get(city: string): Promise<WeatherData | null>;
  set(city: string, data: WeatherData): Promise<void>;
}

type CacheEntry = { data: WeatherData; expiresAt: number };

/**
 * In-process cache backed by a Map. Used in development and as a
 * fallback when AWS credentials are not configured.
 * Phase 6E swaps this out for DynamoWeatherCache with zero changes
 * to WeatherService or TaskService.
 */
export class InMemoryWeatherCache implements WeatherCacheInterface {
  private readonly store = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(ttlMs = 30 * 60 * 1000 /* 30 minutes */) {
    this.ttlMs = ttlMs;
  }

  async get(city: string): Promise<WeatherData | null> {
    const entry = this.store.get(city);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(city);
      return null;
    }
    return entry.data;
  }

  async set(city: string, data: WeatherData): Promise<void> {
    this.store.set(city, { data, expiresAt: Date.now() + this.ttlMs });
  }
}
