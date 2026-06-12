import { makeRng } from './random.js';

const SUPPLIERS = ['Hertz', 'Avis', 'Europcar', 'Sixt', 'Budget', 'Enterprise', 'Alamo', 'Thrifty'];
const CARS = [
  { model: 'Toyota Aygo', category: 'Mini', seats: 4, bags: 1 },
  { model: 'VW Polo', category: 'Economy', seats: 5, bags: 2 },
  { model: 'Ford Focus', category: 'Compact', seats: 5, bags: 2 },
  { model: 'Toyota Corolla', category: 'Intermediate', seats: 5, bags: 3 },
  { model: 'Skoda Octavia', category: 'Standard', seats: 5, bags: 3 },
  { model: 'VW Tiguan', category: 'SUV', seats: 5, bags: 4 },
  { model: 'Kia Sorento', category: 'Full-size SUV', seats: 7, bags: 5 },
  { model: 'Mercedes E-Class', category: 'Premium', seats: 5, bags: 3 },
  { model: 'Tesla Model 3', category: 'Electric', seats: 5, bags: 3 },
  { model: 'VW Transporter', category: 'People carrier', seats: 9, bags: 6 }
];

function daysBetween(pickUp, dropOff) {
  const a = new Date(pickUp).getTime();
  const b = new Date(dropOff).getTime();
  return Math.max(1, Math.ceil((b - a) / 86400000));
}

export function searchCars({ location, pickUpDate, dropOffDate }) {
  if (!location) {
    throw Object.assign(new Error('location is required'), { status: 400 });
  }
  const days = daysBetween(pickUpDate, dropOffDate);
  const rng = makeRng(`cars:${location.toLowerCase()}:${pickUpDate}:${dropOffDate}`);
  const count = rng.int(10, 16);

  const cars = Array.from({ length: count }, (_, i) => {
    const car = rng.pick(CARS);
    const pricePerDay = Math.round((18 + car.seats * rng.float(3, 9)) * rng.float(0.8, 1.6));
    return {
      id: `car-${location.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      ...car,
      supplier: rng.pick(SUPPLIERS),
      transmission: rng.chance(0.6) ? 'Automatic' : 'Manual',
      freeCancellation: rng.chance(0.7),
      unlimitedMileage: rng.chance(0.8),
      rating: Math.round(rng.float(6.5, 9.6) * 10) / 10,
      pricePerDay,
      days,
      totalPrice: pricePerDay * days,
      currency: 'USD'
    };
  });

  return { query: { location, pickUpDate, dropOffDate, days }, count: cars.length, cars };
}
