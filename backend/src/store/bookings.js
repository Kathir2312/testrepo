import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const DB_PATH = process.env.BOOKINGS_DB || new URL('../../data/bookings.json', import.meta.url).pathname;

function load() {
  if (!existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf8'));
  } catch {
    return [];
  }
}

function save(bookings) {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2));
}

function makeReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function createBooking({ type, item, contact, travellers }) {
  if (!['flight', 'hotel', 'car'].includes(type)) {
    throw Object.assign(new Error('type must be flight, hotel or car'), { status: 400 });
  }
  if (!item || !contact?.email || !contact?.firstName || !contact?.lastName) {
    throw Object.assign(new Error('item and contact (firstName, lastName, email) are required'), { status: 400 });
  }
  const bookings = load();
  const booking = {
    id: randomUUID(),
    reference: makeReference(),
    type,
    status: 'confirmed',
    item,
    contact,
    travellers: travellers || [],
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  save(bookings);
  return booking;
}

export function getBooking(reference) {
  return load().find((b) => b.reference === String(reference).toUpperCase()) || null;
}

export function listBookings(email) {
  const all = load();
  return email ? all.filter((b) => b.contact.email.toLowerCase() === email.toLowerCase()) : all;
}
