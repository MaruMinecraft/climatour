"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency, getDictionary, scenarioLabels } from "@/lib/i18n/dictionaries";
import { buildWeatherRecommendation } from "@/lib/weather/recommendation";
import { mockWeatherByDestination } from "@/data/mockWeather";
import { WeatherBadge } from "@/components/WeatherBadge";
import type { Locale, Tour, TravelScenario } from "@/types/travel";

interface TourCardProps {
  tour: Tour;
  locale: Locale;
  scenario: TravelScenario;
  selected: boolean;
  onToggleCompare: (tourId: string) => void;
}

export function TourCard({ tour, locale, scenario, selected, onToggleCompare }: TourCardProps) {
  const dict = getDictionary(locale);
  const weather = mockWeatherByDestination[tour.destinationId];
  const recommendation = buildWeatherRecommendation(scenario, weather.forecast, locale);

  return (
    <article className="tour-card">
      <Image alt={`${tour.city} ${tour.hotelName}`} height={420} src={tour.image} width={760} />
      <div className="tour-card-body">
        <div className="tour-card-heading">
          <div>
            <span className="eyebrow">
              {tour.country} / {tour.city}
            </span>
            <h3>{tour.title}</h3>
          </div>
          <strong>{formatCurrency(tour.price, locale)}</strong>
        </div>
        <p>{tour.description}</p>
        <div className="meta-row">
          <span>{tour.duration} {dict.nights}</span>
          <span>{tour.hotelName}</span>
          <span>{scenarioLabels[locale][scenario]}</span>
        </div>
        <div className="card-weather-row">
          <WeatherBadge
            condition={weather.current.condition}
            locale={locale}
            status={recommendation.status}
            temperature={weather.current.temperature}
          />
          <span className={`fit-pill ${recommendation.status}`}>{recommendation.summary}</span>
        </div>
        <div className="card-actions">
          <button
            className={selected ? "secondary-button active" : "secondary-button"}
            onClick={() => onToggleCompare(tour.id)}
            type="button"
          >
            {selected ? dict.selected : dict.compare}
          </button>
          <Link className="primary-button" href={`/tours/${tour.id}?lang=${locale}&scenario=${scenario}`}>
            {dict.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
