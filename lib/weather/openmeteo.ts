import type { DestinationWeather, WeatherCondition, WeatherForecastDay, WeatherSnapshot } from "@/types/travel";
import { destinations } from "@/data/destinations";

function wmcToCondition(wmc: number): WeatherCondition {
  if (wmc === 0) return "sunny";
  if (wmc <= 3) return "partly-cloudy";
  if (wmc <= 48) return "cloudy";
  if (wmc <= 82) return "rain";
  return "storm";
}

function wmcToIcon(wmc: number): string {
  if (wmc === 0) return "sun";
  if (wmc <= 3) return "cloud-sun";
  if (wmc <= 48) return "cloud";
  return "cloud-rain";
}

export async function fetchWeatherForDestination(destinationId: string): Promise<DestinationWeather | null> {
  const destination = destinations.find((d) => d.id === destinationId);
  if (!destination) return null;

  const { latitude, longitude } = destination;
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,precipitation_probability` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,precipitation_probability_max,relativehumidity_2m_mean` +
    `&timezone=auto&forecast_days=5`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const data = await res.json();

    const now = new Date().toISOString();
    const cur = data.current;
    const daily = data.daily;

    const current: WeatherSnapshot = {
      destinationId,
      date: daily.time[0],
      temperature: Math.round(cur.temperature_2m),
      feelsLike: Math.round(cur.temperature_2m),
      humidity: Math.round(cur.relativehumidity_2m ?? 60),
      windSpeed: Math.round(cur.windspeed_10m),
      precipitationProbability: Math.round(cur.precipitation_probability ?? 0),
      condition: wmcToCondition(cur.weathercode),
      icon: wmcToIcon(cur.weathercode),
      source: "open-meteo",
      updatedAt: now
    };

    const forecast: WeatherForecastDay[] = daily.time.slice(0, 5).map((date: string, i: number) => ({
      date,
      temperature: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
      feelsLike: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
      humidity: Math.round(daily.relativehumidity_2m_mean?.[i] ?? 60),
      windSpeed: Math.round(daily.windspeed_10m_max[i]),
      precipitationProbability: Math.round(daily.precipitation_probability_max[i] ?? 0),
      condition: wmcToCondition(daily.weathercode[i]),
      icon: wmcToIcon(daily.weathercode[i])
    }));

    return { current, forecast };
  } catch {
    return null;
  }
}
