interface WeatherBadgeProps {
  tempC: number;
  condition: string;
  icon: string;
}

export function WeatherBadge({ tempC, condition, icon }: WeatherBadgeProps) {
  // WeatherAPI returns protocol-relative icon URLs (//cdn.weatherapi.com/...)
  const iconUrl = icon.startsWith('//') ? `https:${icon}` : icon;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      (
      <img src={iconUrl} alt={condition} className="w-4 h-4 object-contain" />
      {Math.round(tempC)}°C)
    </span>
  );
}
