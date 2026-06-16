import type { DestinationWeather } from "@/types/travel";

const updatedAt = "2026-06-16T12:00:00.000Z";

export const mockWeatherByDestination: Record<string, DestinationWeather> = {
  antalya: {
    current: {
      destinationId: "antalya",
      date: "2026-06-20",
      temperature: 28,
      feelsLike: 29,
      humidity: 55,
      windSpeed: 5,
      precipitationProbability: 12,
      condition: "sunny",
      icon: "sun",
      source: "mock",
      updatedAt
    },
    forecast: [
      { date: "2026-06-20", temperature: 28, feelsLike: 29, humidity: 55, windSpeed: 5, precipitationProbability: 12, condition: "sunny", icon: "sun" },
      { date: "2026-06-21", temperature: 29, feelsLike: 30, humidity: 57, windSpeed: 6, precipitationProbability: 10, condition: "sunny", icon: "sun" },
      { date: "2026-06-22", temperature: 30, feelsLike: 31, humidity: 54, windSpeed: 7, precipitationProbability: 8, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-23", temperature: 31, feelsLike: 32, humidity: 52, windSpeed: 6, precipitationProbability: 9, condition: "sunny", icon: "sun" },
      { date: "2026-06-24", temperature: 29, feelsLike: 30, humidity: 56, windSpeed: 5, precipitationProbability: 14, condition: "sunny", icon: "sun" }
    ]
  },
  dubai: {
    current: {
      destinationId: "dubai",
      date: "2026-06-20",
      temperature: 36,
      feelsLike: 39,
      humidity: 48,
      windSpeed: 8,
      precipitationProbability: 2,
      condition: "sunny",
      icon: "sun",
      source: "mock",
      updatedAt
    },
    forecast: [
      { date: "2026-06-20", temperature: 36, feelsLike: 39, humidity: 48, windSpeed: 8, precipitationProbability: 2, condition: "sunny", icon: "sun" },
      { date: "2026-06-21", temperature: 37, feelsLike: 40, humidity: 46, windSpeed: 9, precipitationProbability: 1, condition: "sunny", icon: "sun" },
      { date: "2026-06-22", temperature: 38, feelsLike: 41, humidity: 44, windSpeed: 10, precipitationProbability: 1, condition: "sunny", icon: "sun" },
      { date: "2026-06-23", temperature: 37, feelsLike: 40, humidity: 47, windSpeed: 8, precipitationProbability: 2, condition: "sunny", icon: "sun" },
      { date: "2026-06-24", temperature: 36, feelsLike: 39, humidity: 49, windSpeed: 7, precipitationProbability: 3, condition: "sunny", icon: "sun" }
    ]
  },
  sharm: {
    current: {
      destinationId: "sharm",
      date: "2026-06-20",
      temperature: 33,
      feelsLike: 35,
      humidity: 40,
      windSpeed: 7,
      precipitationProbability: 4,
      condition: "sunny",
      icon: "sun",
      source: "mock",
      updatedAt
    },
    forecast: [
      { date: "2026-06-20", temperature: 33, feelsLike: 35, humidity: 40, windSpeed: 7, precipitationProbability: 4, condition: "sunny", icon: "sun" },
      { date: "2026-06-21", temperature: 34, feelsLike: 36, humidity: 39, windSpeed: 7, precipitationProbability: 3, condition: "sunny", icon: "sun" },
      { date: "2026-06-22", temperature: 32, feelsLike: 34, humidity: 42, windSpeed: 8, precipitationProbability: 5, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-23", temperature: 33, feelsLike: 35, humidity: 41, windSpeed: 9, precipitationProbability: 4, condition: "sunny", icon: "sun" },
      { date: "2026-06-24", temperature: 31, feelsLike: 33, humidity: 43, windSpeed: 8, precipitationProbability: 6, condition: "sunny", icon: "sun" }
    ]
  },
  phuket: {
    current: {
      destinationId: "phuket",
      date: "2026-06-20",
      temperature: 29,
      feelsLike: 33,
      humidity: 82,
      windSpeed: 6,
      precipitationProbability: 58,
      condition: "rain",
      icon: "cloud-rain",
      source: "mock",
      updatedAt
    },
    forecast: [
      { date: "2026-06-20", temperature: 29, feelsLike: 33, humidity: 82, windSpeed: 6, precipitationProbability: 58, condition: "rain", icon: "cloud-rain" },
      { date: "2026-06-21", temperature: 30, feelsLike: 34, humidity: 80, windSpeed: 7, precipitationProbability: 45, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-22", temperature: 28, feelsLike: 32, humidity: 84, windSpeed: 8, precipitationProbability: 62, condition: "rain", icon: "cloud-rain" },
      { date: "2026-06-23", temperature: 29, feelsLike: 33, humidity: 81, windSpeed: 6, precipitationProbability: 38, condition: "cloudy", icon: "cloud" },
      { date: "2026-06-24", temperature: 30, feelsLike: 34, humidity: 79, windSpeed: 7, precipitationProbability: 42, condition: "partly-cloudy", icon: "cloud-sun" }
    ]
  },
  bali: {
    current: {
      destinationId: "bali",
      date: "2026-06-20",
      temperature: 27,
      feelsLike: 30,
      humidity: 74,
      windSpeed: 5,
      precipitationProbability: 28,
      condition: "partly-cloudy",
      icon: "cloud-sun",
      source: "mock",
      updatedAt
    },
    forecast: [
      { date: "2026-06-20", temperature: 27, feelsLike: 30, humidity: 74, windSpeed: 5, precipitationProbability: 28, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-21", temperature: 28, feelsLike: 31, humidity: 72, windSpeed: 5, precipitationProbability: 22, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-22", temperature: 27, feelsLike: 30, humidity: 75, windSpeed: 6, precipitationProbability: 31, condition: "cloudy", icon: "cloud" },
      { date: "2026-06-23", temperature: 28, feelsLike: 31, humidity: 73, windSpeed: 5, precipitationProbability: 26, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-24", temperature: 27, feelsLike: 30, humidity: 74, windSpeed: 4, precipitationProbability: 20, condition: "sunny", icon: "sun" }
    ]
  },
  sochi: {
    current: {
      destinationId: "sochi",
      date: "2026-06-20",
      temperature: 24,
      feelsLike: 25,
      humidity: 68,
      windSpeed: 4,
      precipitationProbability: 34,
      condition: "partly-cloudy",
      icon: "cloud-sun",
      source: "mock",
      updatedAt
    },
    forecast: [
      { date: "2026-06-20", temperature: 24, feelsLike: 25, humidity: 68, windSpeed: 4, precipitationProbability: 34, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-21", temperature: 25, feelsLike: 26, humidity: 66, windSpeed: 5, precipitationProbability: 25, condition: "partly-cloudy", icon: "cloud-sun" },
      { date: "2026-06-22", temperature: 23, feelsLike: 24, humidity: 72, windSpeed: 6, precipitationProbability: 44, condition: "rain", icon: "cloud-rain" },
      { date: "2026-06-23", temperature: 24, feelsLike: 25, humidity: 69, windSpeed: 4, precipitationProbability: 30, condition: "cloudy", icon: "cloud" },
      { date: "2026-06-24", temperature: 26, feelsLike: 27, humidity: 64, windSpeed: 5, precipitationProbability: 22, condition: "sunny", icon: "sun" }
    ]
  }
};
