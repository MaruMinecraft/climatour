import { formatShortDate } from "@/lib/i18n/dictionaries";
import type { Locale, WeatherForecastDay } from "@/types/travel";

const rainLabel: Record<Locale, string> = {
  ru: "дождь",
  en: "rain"
};

interface ForecastStripProps {
  forecast: WeatherForecastDay[];
  locale: Locale;
}

export function ForecastStrip({ forecast, locale }: ForecastStripProps) {
  return (
    <div className="forecast-strip">
      {forecast.map((day) => (
        <div className="forecast-day" key={day.date}>
          <span>{formatShortDate(day.date, locale)}</span>
          <strong>{day.temperature}°C</strong>
          <small>{day.precipitationProbability}% {rainLabel[locale]}</small>
        </div>
      ))}
    </div>
  );
}
