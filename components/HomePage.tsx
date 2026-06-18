"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { destinations, getDestinationCopy } from "@/data/destinations";
import { getTourCopy, mockTours } from "@/data/mockTours";
import { mockWeatherByDestination } from "@/data/mockWeather";
import { formatCurrency, getDictionary, scenarioLabels } from "@/lib/i18n/dictionaries";
import { getAverageWeather } from "@/lib/weather/recommendation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TourCard } from "@/components/TourCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import type { Locale, SearchFilters, Tour, TravelScenario } from "@/types/travel";

const TOUR_LIMIT = 16;

const initialFilters: SearchFilters = {
  destinationId: "any",
  startDate: "2026-06-20",
  endDate: "2026-06-27",
  budget: 300000,
  scenario: null,
  minTemp: 20,
  maxTemp: 38,
  noRain: false,
  lowWind: false
};

function filterTours(tours: Tour[], filters: SearchFilters) {
  return tours.filter((tour) => {
    const weather = mockWeatherByDestination[tour.destinationId];
    const averageWeather = getAverageWeather(weather.forecast);

    if (filters.destinationId !== "any" && tour.destinationId !== filters.destinationId) return false;
    if (tour.price > filters.budget) return false;
    if (filters.scenario !== null && !tour.tags.includes(filters.scenario)) return false;
    if (averageWeather.temperature < filters.minTemp || averageWeather.temperature > filters.maxTemp) return false;
    if (filters.noRain && averageWeather.precipitationProbability > 35) return false;
    if (filters.lowWind && averageWeather.windSpeed > 9) return false;

    return true;
  });
}

export function HomePage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [tempInputs, setTempInputs] = useState({ minTemp: String(initialFilters.minTemp), maxTemp: String(initialFilters.maxTemp) });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const dict = getDictionary(locale);

  const allFiltered = useMemo(() => filterTours(mockTours, filters), [filters]);
  const filteredTours = allFiltered.slice(0, TOUR_LIMIT);
  const totalFiltered = allFiltered.length;

  const comparedTours = compareIds
    .map((id) => mockTours.find((tour) => tour.id === id))
    .filter((tour): tour is Tour => Boolean(tour));

  function updateFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleScenario(scenario: TravelScenario) {
    setFilters((current) => ({
      ...current,
      scenario: current.scenario === scenario ? null : scenario
    }));
  }

  function toggleCompare(tourId: string) {
    setCompareIds((current) => {
      if (current.includes(tourId)) return current.filter((id) => id !== tourId);
      return [...current.slice(-2), tourId];
    });
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">C</span>
          <span>{dict.appName}</span>
        </div>
        <LanguageSwitcher locale={locale} onLocaleChange={setLocale} />
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Weather-driven travel</span>
          <h1>{dict.heroTitle}</h1>
          <p>{dict.heroText}</p>
          <form className="search-panel">
            <label>
              {dict.destination}
              <select
                value={filters.destinationId}
                onChange={(event) => updateFilter("destinationId", event.target.value)}
              >
                <option value="any">{dict.anywhere}</option>
                {destinations.map((destination) => {
                  const copy = getDestinationCopy(destination, locale);
                  return (
                    <option key={destination.id} value={destination.id}>
                      {copy.country} / {copy.city}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              {dict.from}
              <input
                type="date"
                value={filters.startDate}
                onChange={(event) => updateFilter("startDate", event.target.value)}
              />
            </label>
            <label>
              {dict.to}
              <input
                type="date"
                value={filters.endDate}
                onChange={(event) => updateFilter("endDate", event.target.value)}
              />
            </label>
            <label>
              {dict.budget}
              <input
                min={70000}
                max={350000}
                step={5000}
                type="number"
                value={filters.budget}
                onChange={(event) => updateFilter("budget", Number(event.target.value))}
              />
            </label>
          </form>
        </div>
        <div className="hero-media">
          <Image
            alt="Antalya coast"
            height={760}
            src="/destinations/antalya.jpg"
            width={1000}
          />
        </div>
      </section>

      <section className="catalog-shell">
        <aside className="filters-panel">
          <div>
            <span className="eyebrow">{dict.scenario}</span>
            <div className="segmented-control">
              {(["beach", "walk", "excursion", "family"] as TravelScenario[]).map((scenario) => (
                <button
                  className={scenario === filters.scenario ? "active" : ""}
                  key={scenario}
                  onClick={() => toggleScenario(scenario)}
                  type="button"
                >
                  {scenarioLabels[locale][scenario]}
                </button>
              ))}
            </div>
            {filters.scenario === null && (
              <span className="scenario-hint">{dict.scenarioAny}</span>
            )}
          </div>

          <div className="filter-group">
            <span className="eyebrow">{dict.temperature}</span>
            <div className="range-row">
              <input
                max={38}
                min={10}
                type="number"
                value={tempInputs.minTemp}
                onChange={(event) => {
                  const raw = event.target.value;
                  setTempInputs((prev) => ({ ...prev, minTemp: raw }));
                  const num = parseInt(raw, 10);
                  if (raw !== "" && !isNaN(num)) updateFilter("minTemp", num);
                }}
              />
              <span>—</span>
              <input
                max={40}
                min={12}
                type="number"
                value={tempInputs.maxTemp}
                onChange={(event) => {
                  const raw = event.target.value;
                  setTempInputs((prev) => ({ ...prev, maxTemp: raw }));
                  const num = parseInt(raw, 10);
                  if (raw !== "" && !isNaN(num)) updateFilter("maxTemp", num);
                }}
              />
            </div>
          </div>

          <label className="checkbox-row">
            <input checked={filters.noRain} onChange={(event) => updateFilter("noRain", event.target.checked)} type="checkbox" />
            <span>{dict.noRain}</span>
          </label>
          <label className="checkbox-row">
            <input checked={filters.lowWind} onChange={(event) => updateFilter("lowWind", event.target.checked)} type="checkbox" />
            <span>{dict.lowWind}</span>
          </label>

          <div className="active-filter-box">
            <span className="eyebrow">{dict.activeFilters}</span>
            <div className="chip-row">
              {filters.scenario
                ? <span>{scenarioLabels[locale][filters.scenario]}</span>
                : <span>{dict.scenarioAny}</span>
              }
              <span>{filters.minTemp}-{filters.maxTemp}°C</span>
              {filters.noRain && <span>{dict.noRain}</span>}
              {filters.lowWind && <span>{dict.lowWind}</span>}
            </div>
          </div>
        </aside>

        <section className="catalog-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{dict.toursFound}: {filteredTours.length} / 24</span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="empty-state">
              <h3>{dict.noResultsTitle}</h3>
              <p>{dict.noResultsText}</p>
              <button className="primary-button" onClick={() => setFilters(initialFilters)} type="button">
                {dict.clear}
              </button>
            </div>
          ) : (
            <div className="tour-grid">
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  locale={locale}
                  onToggleCompare={toggleCompare}
                  scenario={filters.scenario}
                  selected={compareIds.includes(tour.id)}
                  tour={tour}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      {comparedTours.length > 0 && (
        <div className="comparison-bar">
          <div>
            <span className="eyebrow">{dict.comparison}</span>
            <strong>{comparedTours.length} / 3</strong>
          </div>
          <div className="comparison-items">
            {comparedTours.map((tour) => (
              <span key={tour.id} className="comparison-chip">
                {getTourCopy(tour, locale).city} · {formatCurrency(tour.price, locale)}
              </span>
            ))}
          </div>
          <div className="comparison-bar-actions">
            {comparedTours.length >= 2 && (
              <button
                className="primary-button"
                onClick={() => setShowComparison(true)}
                type="button"
              >
                {dict.comparison}
              </button>
            )}
            <button className="secondary-button" onClick={() => setCompareIds([])} type="button">
              {dict.clear}
            </button>
          </div>
        </div>
      )}

      {showComparison && (
        <ComparisonTable
          tours={comparedTours}
          locale={locale}
          scenario={filters.scenario}
          onClose={() => setShowComparison(false)}
        />
      )}
    </main>
  );
}
