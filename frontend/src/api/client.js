async function get(path, params) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const res = await fetch(`/api${path}${qs}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

async function post(path, body) {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

export const api = {
  airports: (q) => get('/airports', q ? { q } : undefined),
  searchFlights: (params) => get('/flights/search', params),
  searchHotels: (params) => get('/hotels/search', params),
  searchCars: (params) => get('/cars/search', params),
  createBooking: (payload) => post('/bookings', payload),
  getBooking: (reference) => get(`/bookings/${reference}`)
};

export function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export function formatDuration(mins) {
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}
