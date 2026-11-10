/** The weather of Bogotá for the widget of the home. */
export type Weather = {
  /** Now, in °C (rounded). */
  temp: number;
  /** Today's high and low, in °C (rounded). */
  max: number;
  min: number;
  /** Today's highest chance of rain, 0-100. */
  rain: number;
  /** WMO weather code of this moment (0 clear, 1-2 partly cloudy, 3 overcast, 45-48 fog, 5x-6x-8x rain, 7x snow, 9x storm). */
  code: number;
  isDay: boolean;
};

// Open-Meteo: free for non-commercial use and it asks for credit (the widget links to open-meteo.com).
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=4.711&longitude=-74.0721" +
  "&current=temperature_2m,weather_code,is_day" +
  "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
  "&timezone=America%2FBogota&forecast_days=1";

/**
 * Asked from the server, not from the visitor's browser: the visitor's address never reaches the weather
 * service, there is one request per 15 minutes however many people come, and the page needs no loading
 * state. If the service is down it returns null and the widget shows dashes.
 */
export async function getBogotaWeather(): Promise<Weather | null> {
  try {
    const res = await fetch(URL, { next: { revalidate: 900 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    const temp = Number(data?.current?.temperature_2m);
    const code = Number(data?.current?.weather_code);
    const max = Number(data?.daily?.temperature_2m_max?.[0]);
    const min = Number(data?.daily?.temperature_2m_min?.[0]);
    const rain = Number(data?.daily?.precipitation_probability_max?.[0]);
    if (![temp, code, max, min].every(Number.isFinite)) return null;
    return {
      temp: Math.round(temp),
      max: Math.round(max),
      min: Math.round(min),
      rain: Number.isFinite(rain) ? Math.round(rain) : 0,
      code,
      isDay: data?.current?.is_day === 1,
    };
  } catch {
    return null;
  }
}
