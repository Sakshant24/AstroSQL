import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          🚀 NASA Missions
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Missions
            </Link>
          </li>
          <li>
            <Link to="/instruments" className={isActive('/instruments') ? 'active' : ''}>
              Instruments
            </Link>
          </li>
          <li>
            <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/vehicles" className={isActive('/vehicles') ? 'active' : ''}>
              Vehicles
            </Link>
          </li>
          <li>
            <Link to="/researchers" className={isActive('/researchers') ? 'active' : ''}>
              Researchers
            </Link>
          </li>
          <li>
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;