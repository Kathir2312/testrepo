import express from 'express';
import cors from 'cors';
import { AIRPORTS } from './data/airports.js';
import { AIRLINES } from './data/airlines.js';
import { searchFlights } from './data/flights.js';
import { searchHotels } from './data/hotels.js';
import { searchCars } from './data/cars.js';
import { createBooking, getBooking, listBookings } from './store/bookings.js';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function requireDate(value, field) {
  if (!value || !ISO_DATE.test(value)) {
    throw Object.assign(new Error(`${field} is required (YYYY-MM-DD)`), { status: 400 });
  }
  return value;
}

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'skyscout-backend' }));

  app.get('/api/airports', (req, res) => {
    const q = (req.query.q || '').toLowerCase();
    const results = q
      ? AIRPORTS.filter((a) =>
          [a.code, a.city, a.country, a.name].some((v) => v.toLowerCase().includes(q))
        )
      : AIRPORTS;
    res.json({ airports: results });
  });

  app.get('/api/airlines', (_req, res) => res.json({ airlines: AIRLINES }));

  app.get('/api/flights/search', (req, res, next) => {
    try {
      const { origin, destination, returnDate, adults, cabinClass } = req.query;
      const departDate = requireDate(req.query.departDate, 'departDate');
      if (returnDate) requireDate(returnDate, 'returnDate');
      res.json(
        searchFlights({
          origin,
          destination,
          departDate,
          returnDate,
          adults: Math.min(9, Math.max(1, parseInt(adults, 10) || 1)),
          cabinClass
        })
      );
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/hotels/search', (req, res, next) => {
    try {
      const { city, guests, rooms } = req.query;
      const checkIn = requireDate(req.query.checkIn, 'checkIn');
      const checkOut = requireDate(req.query.checkOut, 'checkOut');
      res.json(
        searchHotels({
          city,
          checkIn,
          checkOut,
          guests: Math.max(1, parseInt(guests, 10) || 2),
          rooms: Math.max(1, parseInt(rooms, 10) || 1)
        })
      );
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/cars/search', (req, res, next) => {
    try {
      const { location } = req.query;
      const pickUpDate = requireDate(req.query.pickUpDate, 'pickUpDate');
      const dropOffDate = requireDate(req.query.dropOffDate, 'dropOffDate');
      res.json(searchCars({ location, pickUpDate, dropOffDate }));
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/bookings', (req, res, next) => {
    try {
      res.status(201).json(createBooking(req.body || {}));
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/bookings', (req, res) => {
    res.json({ bookings: listBookings(req.query.email) });
  });

  app.get('/api/bookings/:reference', (req, res) => {
    const booking = getBooking(req.params.reference);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  return app;
}
