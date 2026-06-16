import type { TravelScenario } from "@/types/travel";

export interface ScenarioWeatherThreshold {
  minTemp: number;
  maxTemp: number;
}

export interface WeatherThresholds {
  scenarios: Record<TravelScenario, ScenarioWeatherThreshold>;
  maxRainProbability: number;
  maxWindSpeed: number;
  maxHumidity: number;
}

function readNumber(name: string, fallback: number) {
  const value = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`];
  const parsed = value ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getWeatherThresholds(): WeatherThresholds {
  return {
    scenarios: {
      beach: {
        minTemp: readNumber("WEATHER_BEACH_MIN_TEMP", readNumber("NEXT_PUBLIC_WEATHER_BEACH_MIN_TEMP", 24)),
        maxTemp: readNumber("WEATHER_BEACH_MAX_TEMP", readNumber("NEXT_PUBLIC_WEATHER_BEACH_MAX_TEMP", 31))
      },
      walk: {
        minTemp: readNumber("WEATHER_WALK_MIN_TEMP", readNumber("NEXT_PUBLIC_WEATHER_WALK_MIN_TEMP", 16)),
        maxTemp: readNumber("WEATHER_WALK_MAX_TEMP", readNumber("NEXT_PUBLIC_WEATHER_WALK_MAX_TEMP", 27))
      },
      excursion: {
        minTemp: readNumber("WEATHER_EXCURSION_MIN_TEMP", readNumber("NEXT_PUBLIC_WEATHER_EXCURSION_MIN_TEMP", 18)),
        maxTemp: readNumber("WEATHER_EXCURSION_MAX_TEMP", readNumber("NEXT_PUBLIC_WEATHER_EXCURSION_MAX_TEMP", 26))
      },
      family: {
        minTemp: readNumber("WEATHER_FAMILY_MIN_TEMP", readNumber("NEXT_PUBLIC_WEATHER_FAMILY_MIN_TEMP", 22)),
        maxTemp: readNumber("WEATHER_FAMILY_MAX_TEMP", readNumber("NEXT_PUBLIC_WEATHER_FAMILY_MAX_TEMP", 28))
      }
    },
    maxRainProbability: readNumber(
      "WEATHER_MAX_RAIN_PROBABILITY",
      readNumber("NEXT_PUBLIC_WEATHER_MAX_RAIN_PROBABILITY", 35)
    ),
    maxWindSpeed: readNumber("WEATHER_MAX_WIND_SPEED", readNumber("NEXT_PUBLIC_WEATHER_MAX_WIND_SPEED", 9)),
    maxHumidity: readNumber("WEATHER_MAX_HUMIDITY", readNumber("NEXT_PUBLIC_WEATHER_MAX_HUMIDITY", 75))
  };
}
