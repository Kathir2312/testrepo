export const AIRPORTS = [
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'London Heathrow' },
  { code: 'LGW', city: 'London', country: 'United Kingdom', name: 'London Gatwick' },
  { code: 'MAN', city: 'Manchester', country: 'United Kingdom', name: 'Manchester' },
  { code: 'EDI', city: 'Edinburgh', country: 'United Kingdom', name: 'Edinburgh' },
  { code: 'JFK', city: 'New York', country: 'United States', name: 'John F. Kennedy Intl' },
  { code: 'EWR', city: 'New York', country: 'United States', name: 'Newark Liberty Intl' },
  { code: 'LAX', city: 'Los Angeles', country: 'United States', name: 'Los Angeles Intl' },
  { code: 'SFO', city: 'San Francisco', country: 'United States', name: 'San Francisco Intl' },
  { code: 'ORD', city: 'Chicago', country: 'United States', name: "Chicago O'Hare" },
  { code: 'MIA', city: 'Miami', country: 'United States', name: 'Miami Intl' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Paris Charles de Gaulle' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Schiphol' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt am Main' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', name: 'Adolfo Suárez Madrid–Barajas' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', name: 'Barcelona El Prat' },
  { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Rome Fiumicino' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul' },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', name: 'Dubai Intl' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad Intl' },
  { code: 'DEL', city: 'Delhi', country: 'India', name: 'Indira Gandhi Intl' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj Intl' },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai Intl' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', name: 'Kempegowda Intl' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', name: 'Hong Kong Intl' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Tokyo Narita' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Kingsford Smith' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson' },
  { code: 'GRU', city: 'São Paulo', country: 'Brazil', name: 'São Paulo–Guarulhos' }
];

export function findAirport(code) {
  return AIRPORTS.find((a) => a.code === String(code).toUpperCase()) || null;
}
