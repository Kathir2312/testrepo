import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import FlightResults from './pages/FlightResults.jsx';
import HotelResults from './pages/HotelResults.jsx';
import CarResults from './pages/CarResults.jsx';
import Booking from './pages/Booking.jsx';
import Confirmation from './pages/Confirmation.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightResults />} />
          <Route path="/hotels" element={<HotelResults />} />
          <Route path="/cars" element={<CarResults />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/confirmation/:reference" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
