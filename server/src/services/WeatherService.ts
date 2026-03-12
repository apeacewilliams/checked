import { config } from '../config/index.js';
import type { WeatherCacheInterface, WeatherData } from './WeatherCache.js';

interface WeatherApiResponse {
  current: {
    temp_c: number;
    temp_f: number;
    condition: { text: string; icon: string };
    humidity: number;
    wind_kph: number;
  };
}

/**
 * Fetches current weather for a city from WeatherAPI.com.
 * Never throws — any failure (bad city, network error, quota exceeded,
 * missing API key) returns null so task operations are never blocked.
 *
 * Cache is injected so Phase 6E can swap InMemoryWeatherCache for
 * DynamoWeatherCache without touching this class.
 */
export class WeatherService {
  constructor(private readonly cache: WeatherCacheInterface) {}

  async getWeather(city: string): Promise<WeatherData | null> {
    if (!config.weatherApiKey) return null;

    try {
      const cached = await this.cache.get(city);
      if (cached) return cached;

      const url = `https://api.weatherapi.com/v1/current.json?key=${config.weatherApiKey}&q=${encodeURIComponent(city)}`;
      const response = await fetch(url);

      if (!response.ok) return null;

      const json = (await response.json()) as WeatherApiResponse;

      const data: WeatherData = {
        tempC: json.current.temp_c,
        tempF: json.current.temp_f,
        condition: json.current.condition.text,
        icon: json.current.condition.icon,
        humidity: json.current.humidity ?? null,
        windKph: json.current.wind_kph ?? null,
      };

      await this.cache.set(city, data);
      return data;
    } catch {
      return null;
    }
  }
}
