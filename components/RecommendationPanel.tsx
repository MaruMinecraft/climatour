import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale, WeatherRecommendation } from "@/types/travel";

interface RecommendationPanelProps {
  recommendation: WeatherRecommendation;
  locale: Locale;
}

export function RecommendationPanel({ recommendation, locale }: RecommendationPanelProps) {
  const dict = getDictionary(locale);

  return (
    <section className={`recommendation-panel ${recommendation.status}`}>
      <div className="recommendation-header">
        <h3>{recommendation.summary}</h3>
      </div>
      <div className="recommendation-grid">
        <div>
          <h4>{dict.weatherSummary}</h4>
          <ul>
            {recommendation.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
            {recommendation.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{dict.packing}</h4>
          <ul>
            {recommendation.packingTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
