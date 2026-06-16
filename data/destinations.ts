import type { Destination, Locale } from "@/types/travel";

const ruDestinationCopy: Record<string, Pick<Destination, "bestTimeToGo" | "city" | "climateSummary" | "country" | "resort">> = {
  antalya: {
    bestTimeToGo: "Май-июнь и сентябрь-октябрь обычно самые сбалансированные месяцы для пляжа и семейных поездок.",
    city: "Анталья",
    climateSummary: "Теплое средиземноморское побережье с длинным пляжным сезоном и сухой летней погодой.",
    country: "Турция",
    resort: "Лара / Белек"
  },
  bali: {
    bestTimeToGo: "Май-сентябрь обычно лучше подходят для пляжей, прогулок и поездок по острову.",
    city: "Бали",
    climateSummary: "Тропический островной климат с теплой погодой, влажным воздухом и более сильным сезоном дождей зимой.",
    country: "Индонезия",
    resort: "Нуса-Дуа / Убуд"
  },
  dubai: {
    bestTimeToGo: "Ноябрь-март - самые комфортные месяцы для пляжа, городских прогулок и экскурсий.",
    city: "Дубай",
    climateSummary: "Солнечно и сухо большую часть года, а летние месяцы очень жаркие.",
    country: "ОАЭ",
    resort: "Джумейра"
  },
  phuket: {
    bestTimeToGo: "Декабрь-март обычно дают самую ясную пляжную погоду.",
    city: "Пхукет",
    climateSummary: "Тропическая островная погода с теплым морем, высокой влажностью и сезонным риском дождей.",
    country: "Таиланд",
    resort: "Карон / Ката"
  },
  sharm: {
    bestTimeToGo: "Март-май и октябрь-ноябрь - самые комфортные периоды для пляжа и снорклинга.",
    city: "Шарм-эль-Шейх",
    climateSummary: "Сухой курорт Красного моря с теплой водой, сильным солнцем и редкими дождями.",
    country: "Египет",
    resort: "Наама-Бей"
  },
  sochi: {
    bestTimeToGo: "Июнь-сентябрь для пляжа; апрель-май и октябрь для прогулок и экскурсий.",
    city: "Сочи",
    climateSummary: "Черноморское побережье с мягкой зимой, теплым летом и влажным субтропическим влиянием.",
    country: "Россия",
    resort: "Имерети / Роза Хутор"
  }
};

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

export function getDestinationCopy(destination: Destination, locale: Locale) {
  if (locale === "en") {
    return {
      bestTimeToGo: destination.bestTimeToGo,
      city: destination.city,
      climateSummary: destination.climateSummary,
      country: destination.country,
      resort: destination.resort
    };
  }

  return ruDestinationCopy[destination.id] ?? {
    bestTimeToGo: destination.bestTimeToGo,
    city: destination.city,
    climateSummary: destination.climateSummary,
    country: destination.country,
    resort: destination.resort
  };
}
