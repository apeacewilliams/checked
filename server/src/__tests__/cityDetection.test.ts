import { describe, it, expect } from 'vitest';
import { detectCityCandidate } from '../utils/cityDetection.js';

describe('detectCityCandidate', () => {
  it('returns null for empty string', () => {
    expect(detectCityCandidate('')).toBeNull();
  });

  it('returns null when no city present', () => {
    expect(detectCityCandidate('buy milk and eggs')).toBeNull();
    expect(detectCityCandidate('schedule team meeting')).toBeNull();
  });

  it('matches a city case-insensitively', () => {
    expect(detectCityCandidate('Visit PARIS next week')).toBe('paris');
    expect(detectCityCandidate('TOKYO conference')).toBe('tokyo');
    expect(detectCityCandidate('Book a room in BERLIN')).toBe('berlin');
  });

  it('returns the matched city in lowercase', () => {
    const result = detectCityCandidate('flight to Tokyo');
    expect(result).toBe('tokyo');
  });

  it('finds "new york city" before "new york" before "york" (longest-first ordering)', () => {
    // The city list has "new york city" (longest) sorted before "new york" before "york"
    expect(detectCityCandidate('conference in new york city')).toBe('new york city');
    expect(detectCityCandidate('trip to new york next week')).toBe('new york');
  });

  it('finds "los angeles" before "angeles"', () => {
    const result = detectCityCandidate('trip to los angeles');
    expect(result).toBe('los angeles');
  });

  it('matches city embedded in a longer sentence', () => {
    const result = detectCityCandidate('Book a hotel in berlin for the summit');
    expect(result).toBe('berlin');
  });

  it('returns the first match when multiple cities are present', () => {
    const result = detectCityCandidate('fly from paris to rome');
    expect(result).not.toBeNull();
    expect(result).toBe('paris');
  });
});
