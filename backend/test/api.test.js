import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

process.env.BOOKINGS_DB = '/tmp/skyscout-test-bookings.json';

function request(app, method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${server.address().port}${path}`, {
          method,
          headers: body ? { 'content-type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined
        });
        const json = await res.json();
        resolve({ status: res.status, json });
      } catch (err) {
        reject(err);
      } finally {
        server.close();
      }
    });
  });
}

test('health check', async () => {
  const res = await request(createApp(), 'GET', '/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.json.status, 'ok');
});

test('flight search returns deterministic itineraries', async () => {
  const app = createApp();
  const path = '/api/flights/search?origin=LHR&destination=JFK&departDate=2026-07-01&adults=2';
  const a = await request(app, 'GET', path);
  const b = await request(app, 'GET', path);
  assert.equal(a.status, 200);
  assert.ok(a.json.itineraries.length >= 18);
  assert.deepEqual(a.json.itineraries[0], b.json.itineraries[0]);
  assert.equal(a.json.itineraries[0].totalPrice, a.json.itineraries[0].pricePerAdult * 2);
});

test('flight search validates input', async () => {
  const res = await request(createApp(), 'GET', '/api/flights/search?origin=XXX&destination=JFK&departDate=2026-07-01');
  assert.equal(res.status, 400);
});

test('hotel search returns priced stays', async () => {
  const res = await request(createApp(), 'GET', '/api/hotels/search?city=Paris&checkIn=2026-07-01&checkOut=2026-07-04');
  assert.equal(res.status, 200);
  const hotel = res.json.hotels[0];
  assert.equal(res.json.query.nights, 3);
  assert.equal(hotel.totalPrice, hotel.pricePerNight * 3);
});

test('car search works', async () => {
  const res = await request(createApp(), 'GET', '/api/cars/search?location=Madrid&pickUpDate=2026-07-01&dropOffDate=2026-07-05');
  assert.equal(res.status, 200);
  assert.ok(res.json.cars.length > 0);
});

test('booking lifecycle: create then fetch by reference', async () => {
  const app = createApp();
  const created = await request(app, 'POST', '/api/bookings', {
    type: 'flight',
    item: { id: 'LHRJFK-2026-07-01-0', totalPrice: 420 },
    contact: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' }
  });
  assert.equal(created.status, 201);
  assert.equal(created.json.status, 'confirmed');
  assert.match(created.json.reference, /^[A-Z2-9]{6}$/);

  const fetched = await request(app, 'GET', `/api/bookings/${created.json.reference}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.json.contact.email, 'ada@example.com');
});

test('booking validation rejects bad payloads', async () => {
  const res = await request(createApp(), 'POST', '/api/bookings', { type: 'spaceship' });
  assert.equal(res.status, 400);
});
