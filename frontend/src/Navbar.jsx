import { NavLink } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/', label: 'Dashboard', icon: '' },
  { to: '/restaurants', label: 'Restaurants', icon: '' },
  { to: '/reservations', label: 'Reservations', icon: '' },
  { to: '/reviews', label: 'Reviews', icon: '' },
  { to: '/users', label: 'Users', icon: '' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⬡</span>
        <span className="brand-text">
          <span className="brand-name">CSE412 Project</span>
          <span className="brand-sub">Restaurant Platform</span>
        </span>
      </div>
      <ul className="nav-links">
        {links.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
