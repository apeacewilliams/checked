import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WeatherData, WeatherCacheInterface } from '../services/WeatherCache.js';

vi.mock('../config/index.js', () => ({
  config: { weatherApiKey: 'test-api-key' },
}));

function makeCache(
  hit: WeatherData | null = null,
): WeatherCacheInterface & { setCalls: unknown[][] } {
  const setCalls: unknown[][] = [];
  return {
    get: vi.fn().mockResolvedValue(hit),
    set: vi.fn().mockImplementation((...args: unknown[]) => {
      setCalls.push(args);
      return Promise.resolve();
    }),
    setCalls,
  };
}

const apiResponse = {
  current: {
    temp_c: 22.5,
    temp_f: 72.5,
    condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
    humidity: 60,
    wind_kph: 15,
  },
};

const expectedWeather: WeatherData = {
  tempC: 22.5,
  tempF: 72.5,
  condition: 'Partly cloudy',
  icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
  humidity: 60,
  windKph: 15,
};

describe('WeatherService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when weatherApiKey is absent', async () => {
    const { config } = await import('../config/index.js');
    (config as { weatherApiKey: string | null }).weatherApiKey = null;

    const { WeatherService } = await import('../services/WeatherService.js');
    const service = new WeatherService(makeCache());
    expect(await service.getWeather('london')).toBeNull();

    (config as { weatherApiKey: string | null }).weatherApiKey = 'test-api-key';
  });

  it('returns cached data without calling fetch on cache hit', async () => {
    const { WeatherService } = await import('../services/WeatherService.js');
    const fetchSpy = vi.spyOn(global, 'fetch');
    const cache = makeCache(expectedWeather);
    const service = new WeatherService(cache);

    const result = await service.getWeather('london');
    expect(result).toEqual(expectedWeather);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('calls fetch on cache miss and returns mapped WeatherData', async () => {
    const { WeatherService } = await import('../services/WeatherService.js');
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => apiResponse,
    } as Response);

    const cache = makeCache(null);
    const service = new WeatherService(cache);

    const result = await service.getWeather('london');
    expect(result).toEqual(expectedWeather);
  });

  it('stores the result in cache after a successful fetch', async () => {
    const { WeatherService } = await import('../services/WeatherService.js');
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => apiResponse,
    } as Response);

    const cache = makeCache(null);
    const service = new WeatherService(cache);
    await service.getWeather('london');

    expect(cache.set).toHaveBeenCalledWith('london', expectedWeather);
  });

  it('returns null when fetch responds with non-OK status', async () => {
    const { WeatherService } = await import('../services/WeatherService.js');
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false } as Response);

    const service = new WeatherService(makeCache());
    expect(await service.getWeather('london')).toBeNull();
  });

  it('returns null when fetch throws a network error', async () => {
    const { WeatherService } = await import('../services/WeatherService.js');
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('network error'));

    const service = new WeatherService(makeCache());
    expect(await service.getWeather('london')).toBeNull();
  });

  it('correctly maps all API fields to WeatherData', async () => {
    const { WeatherService } = await import('../services/WeatherService.js');
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => apiResponse,
    } as Response);

    const service = new WeatherService(makeCache());
    const result = await service.getWeather('london');

    expect(result?.tempC).toBe(22.5);
    expect(result?.tempF).toBe(72.5);
    expect(result?.condition).toBe('Partly cloudy');
    expect(result?.icon).toBe('//cdn.weatherapi.com/weather/64x64/day/116.png');
    expect(result?.humidity).toBe(60);
    expect(result?.windKph).toBe(15);
  });
});
