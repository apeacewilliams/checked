import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env['PORT'] || '4000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  databaseUrl: requireEnv('DATABASE_URL'),
  clientUrl: process.env['CLIENT_URL'] || 'http://localhost:5173',
  firebaseProjectId: requireEnv('FIREBASE_PROJECT_ID'),
  firebasePrivateKey: requireEnv('FIREBASE_PRIVATE_KEY'),
  firebaseClientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
  // Optional — weather enrichment is silently disabled when absent
  weatherApiKey: process.env['WEATHER_API_KEY'] ?? '',
  // Optional — DynamoDB weather cache. Falls back to in-memory cache when absent
  awsRegion: process.env['AWS_REGION'] ?? '',
  dynamoTableName: process.env['DYNAMODB_TABLE_NAME'] ?? 'weather-cache',

  get isProduction() {
    return this.nodeEnv === 'production';
  },
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
} as const;
