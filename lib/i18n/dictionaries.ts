import type { Locale, TravelScenario } from "@/types/travel";

export const scenarioLabels: Record<Locale, Record<TravelScenario, string>> = {
  ru: {
    beach: "Пляж",
    walk: "Прогулки",
    excursion: "Экскурсии",
    family: "Семья"
  },
  en: {
    beach: "Beach",
    walk: "Walks",
    excursion: "Excursions",
    family: "Family"
  }
};

export const dictionaries = {
  ru: {
    appName: "Climatour",
    heroTitle: "Туры, которые подходят по погоде",
    heroText: "Выберите даты, бюджет и сценарий отдыха. Мы покажем направления с понятным погодным выводом.",
    destination: "Направление",
    anywhere: "Куда угодно",
    dates: "Даты",
    from: "С",
    to: "По",
    budget: "Бюджет до",
    scenario: "Сценарий",
    findTours: "Подобрать туры",
    filters: "Погодные фильтры",
    temperature: "Температура",
    noRain: "Без дождя",
    lowWind: "Слабый ветер",
    comfortableHumidity: "Комфортная влажность",
    activeFilters: "Выбранные условия",
    toursFound: "Найдено туров",
    compare: "Сравнить",
    details: "Подробнее",
    selected: "Выбрано",
    remove: "Убрать",
    comparison: "Сравнение",
    clear: "Очистить",
    price: "Цена",
    nights: "дн.",
    currentWeather: "Сейчас",
    forecast: "Прогноз",
    humidity: "Влажность",
    wind: "Ветер",
    rain: "Дождь",
    weatherSummary: "Погодный вывод",
    packing: "Что взять",
    bestTime: "Когда лучше ехать",
    leadTitle: "Оставить заявку",
    leadText: "Менеджер свяжется с вами и уточнит детали тура.",
    name: "Имя",
    phone: "Телефон",
    email: "Email",
    consent: "Согласен с обработкой персональных данных",
    send: "Отправить заявку",
    sending: "Отправляем",
    sent: "Заявка отправлена",
    sendError: "Не удалось отправить заявку. Попробуйте еще раз.",
    validationError: "Заполните имя, телефон, email и согласие.",
    noResultsTitle: "По этим условиям ничего не нашли",
    noResultsText: "Попробуйте расширить температуру, увеличить бюджет или отключить фильтр дождя.",
    weatherFallback: "Погода временно недоступна, туры можно смотреть без прогноза.",
    back: "К подбору",
    included: "Включено",
    legal: "Прогноз является справочной информацией и не гарантирует фактическую погоду."
  },
  en: {
    appName: "Climatour",
    heroTitle: "Tours matched to your weather comfort",
    heroText: "Choose dates, budget and trip style. We will show destinations with a clear weather verdict.",
    destination: "Destination",
    anywhere: "Anywhere",
    dates: "Dates",
    from: "From",
    to: "To",
    budget: "Budget up to",
    scenario: "Scenario",
    findTours: "Find tours",
    filters: "Weather filters",
    temperature: "Temperature",
    noRain: "No rain",
    lowWind: "Low wind",
    comfortableHumidity: "Comfortable humidity",
    activeFilters: "Active conditions",
    toursFound: "Tours found",
    compare: "Compare",
    details: "Details",
    selected: "Selected",
    remove: "Remove",
    comparison: "Comparison",
    clear: "Clear",
    price: "Price",
    nights: "days",
    currentWeather: "Now",
    forecast: "Forecast",
    humidity: "Humidity",
    wind: "Wind",
    rain: "Rain",
    weatherSummary: "Weather verdict",
    packing: "Packing tips",
    bestTime: "Best time to go",
    leadTitle: "Send request",
    leadText: "A manager will contact you and confirm the tour details.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    consent: "I agree to personal data processing",
    send: "Send request",
    sending: "Sending",
    sent: "Request sent",
    sendError: "Could not send the request. Please try again.",
    validationError: "Fill in name, phone, email and consent.",
    noResultsTitle: "No tours match these conditions",
    noResultsText: "Try widening the temperature range, increasing budget or disabling the rain filter.",
    weatherFallback: "Weather is temporarily unavailable, tours remain available without forecast.",
    back: "Back to search",
    included: "Included",
    legal: "Forecast is reference information and does not guarantee actual weather."
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatShortDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}
