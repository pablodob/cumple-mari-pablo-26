// Pronóstico diario para Roldán. Se consulta al abrir la página para no mostrar datos viejos.
const date = '2026-10-31';
const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=-32.899&longitude=-60.906&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=16';
const condition = document.querySelector('#weather-condition');
const numbers = document.querySelector('#weather-numbers');
const icon = document.querySelector('#weather-icon');

function describeWeather(code) {
  if (code === 0) return ['Despejado', '☀'];
  if (code <= 2) return ['Algo nublado', '⛅'];
  if (code === 3) return ['Nublado', '☁'];
  if (code === 45 || code === 48) return ['Con niebla', '☁'];
  if (code >= 95) return ['Posibles tormentas', '⚡'];
  if (code >= 51 && code <= 57) return ['Posibles lloviznas', '☂'];
  if (code >= 61 && code <= 67) return ['Posibles lluvias', '☂'];
  if (code >= 80 && code <= 82) return ['Posibles chaparrones', '☂'];
  return ['Tiempo variable', '⛅'];
}

async function loadWeather() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) throw new Error('Pronóstico no disponible');
    const { daily } = await response.json();
    const index = daily?.time?.indexOf(date) ?? -1;
    if (index < 0) {
      condition.textContent = 'Todavía no hay pronóstico para ese día.';
      numbers.textContent = 'Volvé a consultar más cerca del 31/10.';
      return;
    }

    const [description, symbol] = describeWeather(daily.weather_code[index]);
    condition.textContent = description;
    icon.textContent = symbol;
    const min = daily.temperature_2m_min[index];
    const max = daily.temperature_2m_max[index];
    const rain = daily.precipitation_probability_max[index];
    const temperature = Number.isFinite(min) && Number.isFinite(max)
      ? `${Math.round(min)}° a ${Math.round(max)}°C`
      : 'Temperatura no disponible';
    numbers.textContent = `${temperature} · ${Number.isFinite(rain) ? `${Math.round(rain)}% de probabilidad de lluvia` : 'Probabilidad de lluvia no disponible'}`;
  } catch {
    condition.textContent = 'No pudimos consultar el pronóstico.';
    numbers.textContent = 'Probá de nuevo más tarde.';
  } finally {
    clearTimeout(timeout);
  }
}

loadWeather();
