import { AIRLINES } from './airlines.js';
import { AIRPORTS, findAirport } from './airports.js';
import { makeRng } from './random.js';

const CABIN_MULTIPLIER = { economy: 1, premium_economy: 1.6, business: 2.9, first: 4.5 };

const MS_PER_MIN = 60 * 1000;

function approxDistanceFactor(rng) {
  // Without real coordinates, derive a stable per-route "distance" from the RNG.
  return rng.float(1.2, 13.5); // hours of pure flying time for a direct flight
}

function buildLeg(rng, origin, destination, dateISO, routeHours) {
  const stops = rng.chance(0.45) ? 0 : rng.chance(0.75) ? 1 : 2;
  const airline = rng.pick(AIRLINES);
  const departureMinutes = rng.int(0, 47) * 30; // 00:00 - 23:30 in 30 min steps
  const layoverMins = stops === 0 ? 0 : rng.int(45, 200) * stops;
  const durationMins = Math.round(routeHours * 60 * rng.float(0.95, 1.25)) + layoverMins;

  const departure = new Date(`${dateISO}T00:00:00Z`).getTime() + departureMinutes * MS_PER_MIN;
  const arrival = departure + durationMins * MS_PER_MIN;

  const viaPool = AIRPORTS.filter((a) => a.code !== origin.code && a.code !== destination.code);
  const stopAirports = Array.from({ length: stops }, () => rng.pick(viaPool).code);

  return {
    origin: origin.code,
    destination: destination.code,
    departure: new Date(departure).toISOString(),
    arrival: new Date(arrival).toISOString(),
    durationMins,
    stops,
    stopAirports,
    carrier: { code: airline.code, name: airline.name, color: airline.color },
    flightNumber: `${airline.code}${rng.int(100, 1999)}`
  };
}

export function searchFlights({ origin, destination, departDate, returnDate, adults = 1, cabinClass = 'economy' }) {
  const from = findAirport(origin);
  const to = findAirport(destination);
  if (!from || !to) {
    throw Object.assign(new Error('Unknown origin or destination airport code'), { status: 400 });
  }
  if (from.code === to.code) {
    throw Object.assign(new Error('Origin and destination must differ'), { status: 400 });
  }

  const routeRng = makeRng(`route:${from.code}:${to.code}`);
  const routeHours = approxDistanceFactor(routeRng);
  const cabin = CABIN_MULTIPLIER[cabinClass] ? cabinClass : 'economy';

  const rng = makeRng(`search:${from.code}:${to.code}:${departDate}:${returnDate || ''}:${cabin}`);
  const count = rng.int(18, 32);

  const itineraries = Array.from({ length: count }, (_, i) => {
    const outbound = buildLeg(rng, from, to, departDate, routeHours);
    const inbound = returnDate ? buildLeg(rng, to, from, returnDate, routeHours) : null;

    const legs = inbound ? [outbound, inbound] : [outbound];
    const flightMins = legs.reduce((sum, l) => sum + l.durationMins, 0);
    const stopPenalty = legs.reduce((sum, l) => sum + l.stops, 0) * rng.float(15, 45);
    const base = 40 + flightMins * rng.float(0.55, 0.95) - stopPenalty;
    const perAdult = Math.max(35, Math.round(base * CABIN_MULTIPLIER[cabin]));

    return {
      id: `${from.code}${to.code}-${departDate}-${i}`,
      outbound,
      inbound,
      cabinClass: cabin,
      adults,
      pricePerAdult: perAdult,
      totalPrice: perAdult * adults,
      currency: 'USD'
    };
  });

  return {
    query: { origin: from, destination: to, departDate, returnDate: returnDate || null, adults, cabinClass: cabin },
    count: itineraries.length,
    itineraries
  };
}
