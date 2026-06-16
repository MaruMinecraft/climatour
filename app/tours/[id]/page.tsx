import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { destinationById } from "@/data/destinations";
import { mockWeatherByDestination } from "@/data/mockWeather";
import { tourById } from "@/data/mockTours";
import { ForecastStrip } from "@/components/ForecastStrip";
import { LeadForm } from "@/components/LeadForm";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { WeatherBadge } from "@/components/WeatherBadge";
import { formatCurrency, getDictionary, scenarioLabels } from "@/lib/i18n/dictionaries";
import { buildWeatherRecommendation, getAverageWeather } from "@/lib/weather/recommendation";
import type { Locale, TravelScenario } from "@/types/travel";

interface TourPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function normalizeLocale(value: string | string[] | undefined): Locale {
  return value === "en" ? "en" : "ru";
}

function normalizeScenario(value: string | string[] | undefined): TravelScenario {
  return value === "walk" || value === "excursion" || value === "family" ? value : "beach";
}

export default async function TourPage({ params, searchParams }: TourPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const tour = tourById.get(id);

  if (!tour) {
    notFound();
  }

  const locale = normalizeLocale(query.lang);
  const scenario = normalizeScenario(query.scenario);
  const dict = getDictionary(locale);
  const destination = destinationById.get(tour.destinationId);
  const weather = mockWeatherByDestination[tour.destinationId];
  const recommendation = buildWeatherRecommendation(scenario, weather.forecast, locale);
  const averageWeather = getAverageWeather(weather.forecast);

  if (!destination) {
    notFound();
  }

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href={`/?lang=${locale}`}>
          <span className="brand-mark">C</span>
          <span>{dict.appName}</span>
        </Link>
        <Link className="secondary-button" href={`/?lang=${locale}`}>
          {dict.back}
        </Link>
      </header>

      <section className="tour-hero">
        <Image alt={`${tour.city} ${tour.hotelName}`} height={760} src={tour.image} width={1000} />
        <div className="tour-hero-content">
          <span className="eyebrow">
            {tour.country} / {tour.city}
          </span>
          <h1>{tour.title}</h1>
          <p>{tour.description}</p>
          <div className="tour-hero-meta">
            <strong>{formatCurrency(tour.price, locale)}</strong>
            <span>{tour.duration} {dict.nights}</span>
            <span>{tour.hotelName}</span>
            <span>{scenarioLabels[locale][scenario]}</span>
          </div>
          <WeatherBadge
            condition={weather.current.condition}
            locale={locale}
            status={recommendation.status}
            temperature={weather.current.temperature}
          />
        </div>
      </section>

      <section className="tour-detail-grid">
        <div className="tour-detail-main">
          <RecommendationPanel locale={locale} recommendation={recommendation} />

          <section className="detail-section">
            <div className="section-heading compact">
              <div>
                <span className="eyebrow">{dict.forecast}</span>
                <h2>{destination.city}</h2>
              </div>
              <p>{dict.legal}</p>
            </div>
            <ForecastStrip forecast={weather.forecast} locale={locale} />
            <div className="weather-metrics">
              <div>
                <span>{dict.temperature}</span>
                <strong>{averageWeather.temperature}°C</strong>
              </div>
              <div>
                <span>{dict.rain}</span>
                <strong>{averageWeather.precipitationProbability}%</strong>
              </div>
              <div>
                <span>{dict.wind}</span>
                <strong>{averageWeather.windSpeed} m/s</strong>
              </div>
              <div>
                <span>{dict.humidity}</span>
                <strong>{averageWeather.humidity}%</strong>
              </div>
            </div>
          </section>

          <section className="detail-section two-column">
            <div>
              <span className="eyebrow">{dict.bestTime}</span>
              <h2>{destination.bestTimeToGo}</h2>
              <p>{destination.climateSummary}</p>
            </div>
            <div>
              <span className="eyebrow">{dict.included}</span>
              <ul className="included-list">
                {tour.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="tour-detail-aside">
          <LeadForm locale={locale} tourId={tour.id} />
        </aside>
      </section>
    </main>
  );
}
