import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Restaurants from './Restaurants';
import RestaurantDetail from './RestaurantDetail';
import Reservations from './Reservations';
import Reviews from './Reviews';
import Users from './Users';
import './index.css';
import './Restaurants.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar />
        <main style={{
          marginLeft: 240,
          flex: 1,
          padding: '0 40px 60px',
          maxWidth: 1200,
          width: '100%',
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
