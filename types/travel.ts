export type Locale = "ru" | "en";

export type TravelScenario = "beach" | "walk" | "excursion" | "family";

export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "storm"
  | "windy";

export type RecommendationStatus = "good" | "ok" | "bad";

export interface Destination {
  id: string;
  country: string;
  city: string;
  resort?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  climateSummary: string;
  bestTimeToGo: string;
  image: string;
}

export interface Tour {
  id: string;
  title: string;
  destinationId: string;
  country: string;
  city: string;
  hotelName: string;
  description: string;
  price: number;
  currency: "RUB";
  startDate: string;
  endDate: string;
  duration: number;
  image: string;
  tags: TravelScenario[];
  included: string[];
  leadContactTarget: string;
}

export interface WeatherForecastDay {
  date: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  condition: WeatherCondition;
  icon: string;
}

export interface WeatherSnapshot extends WeatherForecastDay {
  destinationId: string;
  source: "mock";
  updatedAt: string;
}

export interface DestinationWeather {
  current: WeatherSnapshot;
  forecast: WeatherForecastDay[];
}

export interface WeatherRecommendation {
  scenario: TravelScenario;
  score: number;
  status: RecommendationStatus;
  summary: string;
  reasons: string[];
  packingTips: string[];
  warnings: string[];
}

export interface SearchFilters {
  destinationId: string;
  startDate: string;
  endDate: string;
  budget: number;
  scenario: TravelScenario;
  minTemp: number;
  maxTemp: number;
  noRain: boolean;
  lowWind: boolean;
  comfortableHumidity: boolean;
}

export interface LeadPayload {
  tourId: string;
  name: string;
  phone: string;
  email: string;
  locale: Locale;
}
