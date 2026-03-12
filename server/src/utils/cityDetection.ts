import { KNOWN_CITIES } from '../data/cities.js';

/**
 * Scans a task title for the first matching known city name.
 * The city list is sorted longest-first so multi-word cities
 * (e.g. "new york") are found before shorter sub-strings (e.g. "york").
 *
 * @returns The matched city in lowercase, or null if none found.
 */
export function detectCityCandidate(title: string): string | null {
  const normalised = title.toLowerCase();

  for (const city of KNOWN_CITIES) {
    if (normalised.includes(city)) {
      return city;
    }
  }

  return null;
}
