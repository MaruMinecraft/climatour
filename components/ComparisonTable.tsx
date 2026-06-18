"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { mockWeatherByDestination } from "@/data/mockWeather";
import { getTourCopy } from "@/data/mockTours";
import { formatCurrency, getDictionary, scenarioLabels } from "@/lib/i18n/dictionaries";
import { getAverageWeather } from "@/lib/weather/recommendation";
import type { DestinationWeather, Locale, Tour, TravelScenario } from "@/types/travel";

interface ComparisonTableProps {
  tours: Tour[];
  locale: Locale;
  scenario: TravelScenario | null;
  onClose: () => void;
}

function weatherConditionLabel(condition: string, locale: Locale): string {
  const map: Record<string, Record<Locale, string>> = {
    sunny: { ru: "Солнечно", en: "Sunny" },
    "partly-cloudy": { ru: "Переменная облачность", en: "Partly cloudy" },
    cloudy: { ru: "Облачно", en: "Cloudy" },
    rain: { ru: "Дождь", en: "Rain" },
    storm: { ru: "Гроза", en: "Storm" },
    windy: { ru: "Ветрено", en: "Windy" },
  };
  return map[condition]?.[locale] ?? condition;
}

function getProsAndCons(tour: Tour, weather: DestinationWeather, locale: Locale) {
  const avg = getAverageWeather(weather.forecast);
  const pros: string[] = [];
  const cons: string[] = [];

  if (tour.price < 150000) {
    pros.push(locale === "ru" ? "Доступная цена" : "Affordable price");
  } else if (tour.price > 280000) {
    cons.push(locale === "ru" ? "Высокая стоимость" : "High price");
  }

  if (tour.included.includes("All inclusive")) {
    pros.push(locale === "ru" ? "Всё включено — нет скрытых трат" : "All-inclusive — no hidden costs");
  }
  if (!tour.included.includes("Flight")) {
    cons.push(locale === "ru" ? "Перелёт не включён" : "Flight not included");
  }
  if (tour.included.includes("Transfer")) {
    pros.push(locale === "ru" ? "Трансфер включён" : "Transfer included");
  }

  if (tour.duration >= 9) {
    pros.push(locale === "ru" ? "Длинный отдых — не нужно торопиться" : "Long stay — no rush");
  }
  if (tour.duration <= 4) {
    cons.push(locale === "ru" ? "Короткая поездка" : "Short trip");
  }

  if (avg.temperature >= 25 && avg.temperature <= 33) {
    pros.push(locale === "ru" ? "Комфортная температура для отдыха" : "Comfortable temperature");
  }
  if (avg.temperature > 37) {
    cons.push(locale === "ru" ? "Очень жаркая погода" : "Very hot weather");
  }
  if (avg.precipitationProbability > 45) {
    cons.push(locale === "ru" ? "Высокий риск дождей" : "High rain risk");
  } else if (avg.precipitationProbability < 15) {
    pros.push(locale === "ru" ? "Низкий риск дождей" : "Low rain risk");
  }
  if (avg.windSpeed <= 6) {
    pros.push(locale === "ru" ? "Тихий ветер — комфортно на пляже" : "Calm wind — beach-friendly");
  }
  if (avg.windSpeed > 10) {
    cons.push(locale === "ru" ? "Сильный ветер" : "Strong wind");
  }
  if (avg.humidity > 78) {
    cons.push(locale === "ru" ? "Высокая влажность" : "High humidity");
  }

  const ppn = Math.round(tour.price / tour.duration);
  if (ppn < 18000) {
    pros.push(locale === "ru" ? "Выгодная цена за ночь" : "Good price per night");
  } else if (ppn > 40000) {
    cons.push(locale === "ru" ? "Высокая цена за ночь" : "Expensive per night");
  }

  return { pros: pros.slice(0, 4), cons: cons.slice(0, 4) };
}

function getValueRating(tour: Tour, weather: DestinationWeather, locale: Locale): string {
  const avg = getAverageWeather(weather.forecast);
  const ppn = tour.price / tour.duration;
  let score = 0;
  if (ppn < 15000) score += 3;
  else if (ppn < 25000) score += 2;
  else if (ppn < 40000) score += 1;
  if (avg.temperature >= 24 && avg.temperature <= 34) score += 2;
  if (avg.precipitationProbability < 20) score += 2;
  if (tour.included.includes("All inclusive")) score += 2;
  if (tour.included.includes("Transfer")) score += 1;
  if (score >= 8) return locale === "ru" ? "Отличное" : "Excellent";
  if (score >= 5) return locale === "ru" ? "Хорошее" : "Good";
  if (score >= 3) return locale === "ru" ? "Среднее" : "Average";
  return locale === "ru" ? "Слабое" : "Low";
}

export function ComparisonTable({ tours, locale, scenario, onClose }: ComparisonTableProps) {
  const dict = getDictionary(locale);
  const [liveWeather, setLiveWeather] = useState<Record<string, DestinationWeather>>({});

  useEffect(() => {
    const destIds = [...new Set(tours.map((t) => t.destinationId))];
    destIds.forEach(async (id) => {
      const dest = destinations.find((d) => d.id === id);
      if (!dest) return;
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${dest.latitude}&longitude=${dest.longitude}` +
          `&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,precipitation_probability` +
          `&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,precipitation_probability_max,relativehumidity_2m_mean` +
          `&timezone=auto&forecast_days=5`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const daily = data.daily;
        const cur = data.current;

        function wmcToCondition(wmc: number): string {
          if (wmc === 0) return "sunny";
          if (wmc <= 3) return "partly-cloudy";
          if (wmc <= 48) return "cloudy";
          if (wmc <= 82) return "rain";
          return "storm";
        }

        const forecast = daily.time.slice(0, 5).map((date: string, i: number) => ({
          date,
          temperature: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
          feelsLike: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
          humidity: Math.round(daily.relativehumidity_2m_mean?.[i] ?? 60),
          windSpeed: Math.round(daily.windspeed_10m_max[i]),
          precipitationProbability: Math.round(daily.precipitation_probability_max[i] ?? 0),
          condition: wmcToCondition(daily.weathercode[i]),
          icon: "sun"
        }));

        setLiveWeather((prev) => ({
          ...prev,
          [id]: {
            current: {
              destinationId: id,
              date: daily.time[0],
              temperature: Math.round(cur.temperature_2m),
              feelsLike: Math.round(cur.temperature_2m),
              humidity: Math.round(cur.relativehumidity_2m ?? 60),
              windSpeed: Math.round(cur.windspeed_10m),
              precipitationProbability: Math.round(cur.precipitation_probability ?? 0),
              condition: wmcToCondition(cur.weathercode) as any,
              icon: "sun",
              source: "open-meteo",
              updatedAt: new Date().toISOString()
            },
            forecast
          }
        }));
      } catch {
        // ignore, fallback to mock
      }
    });
  }, [tours]);

  if (tours.length === 0) return null;

  const rows: { key: string; label: string; render: (tour: Tour) => React.ReactNode }[] = [
    {
      key: "hotel",
      label: dict.comparisonHotel,
      render: (t) => getTourCopy(t, locale).hotelName
    },
    {
      key: "price",
      label: dict.price,
      render: (t) => <strong>{formatCurrency(t.price, locale)}</strong>
    },
    {
      key: "ppn",
      label: dict.comparisonPricePerNight,
      render: (t) => formatCurrency(Math.round(t.price / t.duration), locale)
    },
    {
      key: "value",
      label: dict.comparisonValueRating,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        return <span className="value-badge">{getValueRating(t, w, locale)}</span>;
      }
    },
    {
      key: "duration",
      label: dict.comparisonDuration,
      render: (t) => `${t.duration} ${dict.nights}`
    },
    {
      key: "included",
      label: dict.comparisonIncluded,
      render: (t) => getTourCopy(t, locale).included.join(", ")
    },
    {
      key: "scenarios",
      label: dict.comparisonScenarios,
      render: (t) => t.tags.map((tag) => scenarioLabels[locale][tag]).join(", ")
    },
    {
      key: "temp",
      label: dict.comparisonTemp,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        return `${getAverageWeather(w.forecast).temperature}°C`;
      }
    },
    {
      key: "rain",
      label: dict.comparisonRain,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        return `${getAverageWeather(w.forecast).precipitationProbability}%`;
      }
    },
    {
      key: "wind",
      label: dict.comparisonWind,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        return `${getAverageWeather(w.forecast).windSpeed} m/s`;
      }
    },
    {
      key: "humidity",
      label: dict.comparisonHumidity,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        return `${getAverageWeather(w.forecast).humidity}%`;
      }
    },
    {
      key: "condition",
      label: dict.comparisonWeatherVerdict,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        return weatherConditionLabel(w.current.condition, locale);
      }
    },
    {
      key: "pros",
      label: dict.comparisonPros,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        const { pros } = getProsAndCons(t, w, locale);
        return (
          <ul className="comparison-list pros">
            {pros.map((p) => <li key={p}>{p}</li>)}
          </ul>
        );
      }
    },
    {
      key: "cons",
      label: dict.comparisonCons,
      render: (t) => {
        const w = liveWeather[t.destinationId] ?? mockWeatherByDestination[t.destinationId];
        const { cons } = getProsAndCons(t, w, locale);
        return (
          <ul className="comparison-list cons">
            {cons.map((c) => <li key={c}>{c}</li>)}
          </ul>
        );
      }
    }
  ];

  const colCount = tours.length;

  return (
    <div className="comparison-overlay">
      <div className="comparison-modal">
        <div className="comparison-modal-header">
          <h2>{dict.comparisonTitle}</h2>
          <button className="secondary-button" onClick={onClose} type="button">
            {dict.clear}
          </button>
        </div>

        <div className="comparison-scroll">
          <table className="comparison-table" style={{ gridTemplateColumns: `180px repeat(${colCount}, 1fr)` }}>
            <thead>
              <tr>
                <th></th>
                {tours.map((tour) => {
                  const copy = getTourCopy(tour, locale);
                  return (
                    <th key={tour.id}>
                      <div className="comparison-th-inner">
                        <span className="comparison-city">{copy.city}</span>
                        <span className="comparison-title">{tour.title}</span>
                        <Link
                          className="secondary-button"
                          href={`/tours/${tour.id}?lang=${locale}${scenario ? `&scenario=${scenario}` : ""}`}
                        >
                          {dict.details}
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td className="comparison-label">{row.label}</td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="comparison-cell">
                      {row.render(tour)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
