import type { Locale, RecommendationStatus, WeatherCondition } from "@/types/travel";

const conditionLabels: Record<Locale, Record<WeatherCondition, string>> = {
  ru: {
    sunny: "ясно",
    "partly-cloudy": "переменно",
    cloudy: "облачно",
    rain: "дождь",
    storm: "гроза",
    windy: "ветрено"
  },
  en: {
    sunny: "sunny",
    "partly-cloudy": "partly cloudy",
    cloudy: "cloudy",
    rain: "rain",
    storm: "storm",
    windy: "windy"
  }
};

interface WeatherBadgeProps {
  status: RecommendationStatus;
  condition: WeatherCondition;
  temperature: number;
  locale: Locale;
}

export function WeatherBadge({ status, condition, temperature, locale }: WeatherBadgeProps) {
  return (
    <span className={`weather-badge ${status}`}>
      <span className="weather-dot" />
      {temperature}°C · {conditionLabels[locale][condition]}
    </span>
  );
}
