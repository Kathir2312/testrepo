import { makeRng } from './random.js';

const NAME_PREFIX = ['Grand', 'Royal', 'Park', 'Harbour', 'Metro', 'The Old', 'Crown', 'Skyline', 'Garden', 'Central'];
const NAME_SUFFIX = ['Plaza Hotel', 'Court Hotel', 'Residence', 'Suites', 'Inn', 'Hotel & Spa', 'Boutique Hotel', 'Lodge', 'House', 'Palace'];
const AMENITIES = ['Free WiFi', 'Pool', 'Gym', 'Spa', 'Free breakfast', 'Bar', 'Restaurant', 'Airport shuttle', 'Parking', 'Pet friendly'];
const AREAS = ['City centre', 'Old town', 'Riverside', 'Business district', 'Near the airport', 'Harbour front'];

function nightsBetween(checkIn, checkOut) {
  const a = new Date(`${checkIn}T00:00:00Z`).getTime();
  const b = new Date(`${checkOut}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((b - a) / 86400000));
}

export function searchHotels({ city, checkIn, checkOut, guests = 2, rooms = 1 }) {
  if (!city) {
    throw Object.assign(new Error('city is required'), { status: 400 });
  }
  const nights = nightsBetween(checkIn, checkOut);
  const rng = makeRng(`hotels:${city.toLowerCase()}:${checkIn}:${checkOut}`);
  const count = rng.int(12, 20);

  const hotels = Array.from({ length: count }, (_, i) => {
    const stars = rng.int(2, 5);
    const pricePerNight = Math.round((30 + stars * rng.float(20, 60)) * rng.float(0.8, 1.3)) * rooms;
    const amenityCount = rng.int(2, 6);
    const amenities = [...AMENITIES].sort(() => rng.float(-1, 1)).slice(0, amenityCount);
    return {
      id: `htl-${city.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      name: `${rng.pick(NAME_PREFIX)} ${rng.pick(NAME_SUFFIX)}`,
      city,
      area: rng.pick(AREAS),
      stars,
      rating: Math.round(rng.float(5.8, 9.8) * 10) / 10,
      reviews: rng.int(120, 8200),
      distanceKm: Math.round(rng.float(0.2, 9) * 10) / 10,
      amenities,
      pricePerNight,
      nights,
      totalPrice: pricePerNight * nights,
      currency: 'USD'
    };
  });

  return { query: { city, checkIn, checkOut, guests, rooms, nights }, count: hotels.length, hotels };
}
