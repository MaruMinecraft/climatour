import type { Destination } from "@/types/travel";

export const destinations: Destination[] = [
  {
    id: "antalya",
    country: "Turkey",
    city: "Antalya",
    resort: "Lara / Belek",
    latitude: 36.8969,
    longitude: 30.7133,
    timezone: "Europe/Istanbul",
    climateSummary: "Warm Mediterranean coast with long beach season and dry summer weather.",
    bestTimeToGo: "May-June and September-October are the most balanced months for beach and family trips.",
    image: "/destinations/antalya.jpg"
  },
  {
    id: "dubai",
    country: "UAE",
    city: "Dubai",
    resort: "Jumeirah",
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: "Asia/Dubai",
    climateSummary: "Sunny and dry most of the year, with very hot summer months.",
    bestTimeToGo: "November-March are the most comfortable months for beach, city walks and excursions.",
    image: "/destinations/dubai.jpg"
  },
  {
    id: "sharm",
    country: "Egypt",
    city: "Sharm El Sheikh",
    resort: "Naama Bay",
    latitude: 27.9158,
    longitude: 34.3299,
    timezone: "Africa/Cairo",
    climateSummary: "Dry Red Sea resort with warm water, strong sun and rare rainfall.",
    bestTimeToGo: "March-May and October-November are the most comfortable periods for beach and snorkeling.",
    image: "/destinations/sharm.jpg"
  },
  {
    id: "phuket",
    country: "Thailand",
    city: "Phuket",
    resort: "Karon / Kata",
    latitude: 7.8804,
    longitude: 98.3923,
    timezone: "Asia/Bangkok",
    climateSummary: "Tropical island weather with warm sea, high humidity and seasonal rain risk.",
    bestTimeToGo: "December-March usually has the clearest beach weather.",
    image: "/destinations/phuket.jpg"
  },
  {
    id: "bali",
    country: "Indonesia",
    city: "Bali",
    resort: "Nusa Dua / Ubud",
    latitude: -8.4095,
    longitude: 115.1889,
    timezone: "Asia/Makassar",
    climateSummary: "Tropical island climate with warm weather, humid air and stronger rain season in winter.",
    bestTimeToGo: "May-September are usually better for beaches, walks and road trips.",
    image: "/destinations/bali.jpg"
  },
  {
    id: "sochi",
    country: "Russia",
    city: "Sochi",
    resort: "Imereti / Rosa Khutor",
    latitude: 43.6028,
    longitude: 39.7342,
    timezone: "Europe/Moscow",
    climateSummary: "Black Sea coast with mild winters, warm summers and humid subtropical influence.",
    bestTimeToGo: "June-September for beach trips; April-May and October for walks and excursions.",
    image: "/destinations/sochi.jpg"
  }
];

export const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
