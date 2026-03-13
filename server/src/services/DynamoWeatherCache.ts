import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { WeatherCacheInterface, WeatherData } from './WeatherCache.js';

const TTL_SECONDS = 30 * 60; // 30 minutes

/**
 * DynamoDB-backed weather cache. Implements WeatherCacheInterface so it is a
 * drop-in replacement for InMemoryWeatherCache with no changes to WeatherService.
 *
 * TTL is handled natively by DynamoDB via the `expiresAt` attribute — no manual
 * cleanup required. Cache persists across server restarts and across multiple
 * server instances.
 */
export class DynamoWeatherCache implements WeatherCacheInterface {
  private readonly client: DynamoDBDocumentClient;

  constructor(
    private readonly tableName: string,
    region: string,
  ) {
    const dynamoClient = new DynamoDBClient({ region });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async get(city: string): Promise<WeatherData | null> {
    try {
      const result = await this.client.send(
        new GetCommand({ TableName: this.tableName, Key: { city } }),
      );

      if (!result.Item) return null;

      // Belt-and-suspenders TTL check — DynamoDB TTL deletion is eventual
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (result.Item['expiresAt'] && result.Item['expiresAt'] < nowSeconds) return null;

      return result.Item['data'] as WeatherData;
    } catch {
      return null;
    }
  }

  async set(city: string, data: WeatherData): Promise<void> {
    try {
      const expiresAt = Math.floor(Date.now() / 1000) + TTL_SECONDS;
      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: { city, data, expiresAt },
        }),
      );
    } catch {
      // Cache write failure is non-fatal — weather enrichment still works,
      // just without caching for this entry
    }
  }
}
