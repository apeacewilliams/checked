import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherBadge } from './WeatherBadge';

const baseProps = {
  tempC: 22.4,
  tempF: 72.3,
  condition: 'Sunny',
  icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
  humidity: 55,
  windKph: 10,
};

describe('WeatherBadge', () => {
  it('renders the temperature rounded to the nearest integer', () => {
    render(<WeatherBadge {...baseProps} />);

    expect(screen.getByText(/22°C/)).toBeInTheDocument();
  });

  it('rounds up correctly', () => {
    render(<WeatherBadge {...baseProps} tempC={22.6} />);

    expect(screen.getByText(/23°C/)).toBeInTheDocument();
  });

  it('uses the condition as the img alt text', () => {
    render(<WeatherBadge {...baseProps} />);

    const img = screen.getByRole('img', { name: 'Sunny' });

    expect(img).toBeInTheDocument();
  });

  it('prepends https: to protocol-relative icon URLs', () => {
    render(<WeatherBadge {...baseProps} />);

    const img = screen.getByRole('img') as HTMLImageElement;

    expect(img.src).toBe('https://cdn.weatherapi.com/weather/64x64/day/113.png');
  });

  it('passes through absolute URLs unchanged', () => {
    render(<WeatherBadge {...baseProps} icon="https://example.com/icon.png" />);

    const img = screen.getByRole('img') as HTMLImageElement;

    expect(img.src).toBe('https://example.com/icon.png');
  });
});
