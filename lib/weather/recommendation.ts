import type {
  Locale,
  TravelScenario,
  WeatherForecastDay,
  WeatherRecommendation
} from "@/types/travel";
import { getWeatherThresholds } from "@/lib/weather/config";

const summaries: Record<Locale, Record<TravelScenario, Record<WeatherRecommendation["status"], string>>> = {
  ru: {
    beach: {
      good: "Хороший выбор для пляжного отдыха",
      ok: "Подойдет для пляжа с небольшими оговорками",
      bad: "Не лучший период для пляжа"
    },
    walk: {
      good: "Комфортно для прогулок",
      ok: "Прогулки лучше планировать гибко",
      bad: "Для долгих прогулок условия слабые"
    },
    excursion: {
      good: "Хорошо подходит для экскурсий",
      ok: "Экскурсии возможны, но лучше выбирать время дня",
      bad: "Погодные условия мешают экскурсиям"
    },
    family: {
      good: "Комфортный вариант для семейной поездки",
      ok: "Для семьи подходит при внимательном планировании",
      bad: "Для семейного отдыха лучше поискать мягче"
    }
  },
  en: {
    beach: {
      good: "Strong match for a beach trip",
      ok: "Works for beach time with small caveats",
      bad: "Not the best beach-weather window"
    },
    walk: {
      good: "Comfortable for walks",
      ok: "Walks are possible with flexible timing",
      bad: "Weak conditions for long walks"
    },
    excursion: {
      good: "Good match for excursions",
      ok: "Excursions work best with careful timing",
      bad: "Weather may interfere with excursions"
    },
    family: {
      good: "Comfortable family-trip option",
      ok: "Family trip works with some planning",
      bad: "Consider a softer weather option for family travel"
    }
  }
};

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function getAverageWeather(forecast: WeatherForecastDay[]) {
  return {
    temperature: average(forecast.map((day) => day.temperature)),
    humidity: average(forecast.map((day) => day.humidity)),
    windSpeed: average(forecast.map((day) => day.windSpeed)),
    precipitationProbability: average(forecast.map((day) => day.precipitationProbability))
  };
}

export function buildWeatherRecommendation(
  scenario: TravelScenario,
  forecast: WeatherForecastDay[],
  locale: Locale
): WeatherRecommendation {
  const thresholds = getWeatherThresholds();
  const weather = getAverageWeather(forecast);
  const scenarioThreshold = thresholds.scenarios[scenario];
  const reasons: string[] = [];
  const warnings: string[] = [];
  const packingTips: string[] = [];

  let score = 100;

  if (weather.temperature < scenarioThreshold.minTemp) {
    score -= 22;
    warnings.push(locale === "ru" ? "Температура ниже комфортного диапазона." : "Temperature is below the comfort range.");
    packingTips.push(locale === "ru" ? "Возьмите легкий слой на вечер." : "Pack a light layer for evenings.");
  } else if (weather.temperature > scenarioThreshold.maxTemp) {
    score -= scenario === "family" || scenario === "excursion" ? 34 : 24;
    warnings.push(locale === "ru" ? "Есть риск жары для выбранного сценария." : "Heat risk is elevated for this scenario.");
    packingTips.push(locale === "ru" ? "Возьмите головной убор и SPF." : "Pack a hat and SPF.");
  } else {
    reasons.push(locale === "ru" ? "Температура в комфортном диапазоне." : "Temperature sits within the comfort range.");
  }

  if (weather.precipitationProbability > thresholds.maxRainProbability) {
    score -= 25;
    warnings.push(locale === "ru" ? "Вероятность дождя выше комфортной." : "Rain probability is above the comfort threshold.");
    packingTips.push(locale === "ru" ? "Положите дождевик или компактный зонт." : "Pack a light rain jacket or compact umbrella.");
  } else {
    reasons.push(locale === "ru" ? "Риск дождя умеренный или низкий." : "Rain risk is moderate or low.");
  }

  if (weather.windSpeed > thresholds.maxWindSpeed) {
    score -= 12;
    warnings.push(locale === "ru" ? "Ветер может ощущаться заметно." : "Wind may be noticeable.");
  } else {
    reasons.push(locale === "ru" ? "Ветер не мешает отдыху." : "Wind should not interfere with the trip.");
  }

  if (weather.humidity > thresholds.maxHumidity) {
    score -= 14;
    warnings.push(locale === "ru" ? "Влажность может снижать ощущение комфорта." : "Humidity may reduce perceived comfort.");
    packingTips.push(locale === "ru" ? "Выбирайте легкую дышащую одежду." : "Choose light breathable clothing.");
  }

  if (packingTips.length === 0) {
    packingTips.push(locale === "ru" ? "Легкая одежда и солнцезащита будут к месту." : "Light clothing and sun protection are sensible.");
  }

  const normalizedScore = Math.max(0, Math.min(100, score));
  const status: WeatherRecommendation["status"] =
    normalizedScore >= 75 ? "good" : normalizedScore >= 52 ? "ok" : "bad";

  return {
    scenario,
    score: normalizedScore,
    status,
    summary: summaries[locale][scenario][status],
    reasons: reasons.slice(0, 3),
    packingTips: Array.from(new Set(packingTips)).slice(0, 3),
    warnings: warnings.slice(0, 3)
  };
}
