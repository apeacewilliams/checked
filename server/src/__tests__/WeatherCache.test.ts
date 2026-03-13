import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InMemoryWeatherCache } from '../services/WeatherCache.js';
import type { WeatherData } from '../services/WeatherCache.js';

const mockWeather: WeatherData = {
  tempC: 22,
  tempF: 71.6,
  condition: 'Sunny',
  icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
  humidity: 55,
  windKph: 10,
};

describe('InMemoryWeatherCache', () => {
  it('returns null for a city that has not been cached', async () => {
    const cache = new InMemoryWeatherCache();
    expect(await cache.get('london')).toBeNull();
  });

  it('returns stored data after set()', async () => {
    const cache = new InMemoryWeatherCache();
    await cache.set('london', mockWeather);
    expect(await cache.get('london')).toEqual(mockWeather);
  });

  it('returns null for a different city after set()', async () => {
    const cache = new InMemoryWeatherCache();
    await cache.set('london', mockWeather);
    expect(await cache.get('paris')).toBeNull();
  });

  it('returns null for an expired entry (0ms TTL)', async () => {
    const cache = new InMemoryWeatherCache(0); // immediate expiry
    await cache.set('london', mockWeather);
    // Wait a tick to ensure Date.now() > expiresAt
    await new Promise((r) => setTimeout(r, 1));
    expect(await cache.get('london')).toBeNull();
  });

  it('returns data for an entry within the TTL window', async () => {
    const cache = new InMemoryWeatherCache(60_000); // 1 minute
    await cache.set('london', mockWeather);
    expect(await cache.get('london')).toEqual(mockWeather);
  });

  it('overwrites an existing entry on subsequent set()', async () => {
    const cache = new InMemoryWeatherCache();
    const updated: WeatherData = { ...mockWeather, tempC: 30 };
    await cache.set('london', mockWeather);
    await cache.set('london', updated);
    expect(await cache.get('london')).toEqual(updated);
  });
});

const mockSend = vi.hoisted(() => vi.fn());

vi.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: vi.fn().mockReturnValue({}),
}));

vi.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: { from: vi.fn().mockReturnValue({ send: mockSend }) },
  GetCommand: vi.fn().mockImplementation((p: unknown) => p),
  PutCommand: vi.fn().mockImplementation((p: unknown) => p),
}));

describe('DynamoWeatherCache', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  async function makeCache() {
    const { DynamoWeatherCache } = await import('../services/DynamoWeatherCache.js');
    return new DynamoWeatherCache('weather-cache', 'us-east-1');
  }

  it('returns null when DynamoDB returns no Item', async () => {
    mockSend.mockResolvedValueOnce({ Item: undefined });
    const cache = await makeCache();
    expect(await cache.get('london')).toBeNull();
  });

  it('returns null when the entry is past its TTL (belt-and-suspenders check)', async () => {
    const pastEpoch = Math.floor(Date.now() / 1000) - 1;
    mockSend.mockResolvedValueOnce({
      Item: { city: 'london', data: mockWeather, expiresAt: pastEpoch },
    });
    const cache = await makeCache();
    expect(await cache.get('london')).toBeNull();
  });

  it('returns WeatherData when Item is present and TTL is valid', async () => {
    const futureEpoch = Math.floor(Date.now() / 1000) + 1800;
    mockSend.mockResolvedValueOnce({
      Item: { city: 'london', data: mockWeather, expiresAt: futureEpoch },
    });
    const cache = await makeCache();
    expect(await cache.get('london')).toEqual(mockWeather);
  });

  it('returns null (never throws) when DynamoDB get throws', async () => {
    mockSend.mockRejectedValueOnce(new Error('network error'));
    const cache = await makeCache();
    expect(await cache.get('london')).toBeNull();
  });

  it('calls PutCommand with city, data, and a future expiresAt on set()', async () => {
    mockSend.mockResolvedValueOnce({});
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    const cache = await makeCache();
    const before = Math.floor(Date.now() / 1000);
    await cache.set('london', mockWeather);
    const after = Math.floor(Date.now() / 1000);

    const putArgs = vi.mocked(PutCommand).mock.calls[0]?.[0] as {
      TableName: string;
      Item: { city: string; data: WeatherData; expiresAt: number };
    };
    expect(putArgs.Item.city).toBe('london');
    expect(putArgs.Item.data).toEqual(mockWeather);
    expect(putArgs.Item.expiresAt).toBeGreaterThanOrEqual(before + 1800);
    expect(putArgs.Item.expiresAt).toBeLessThanOrEqual(after + 1800);
  });

  it('silently swallows errors on set() (non-fatal)', async () => {
    mockSend.mockRejectedValueOnce(new Error('write failed'));
    const cache = await makeCache();
    // Should not throw
    await expect(cache.set('london', mockWeather)).resolves.toBeUndefined();
  });
});
