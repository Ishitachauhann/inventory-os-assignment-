import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Layout.css';

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
];

export default function Layout({ children }) {
  const { flash, clearFlash } = useApp();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <span className="brand-icon">◈</span>
            <span>InventoryOS</span>
          </div>
          <nav className="nav-desktop">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <nav className="nav-mobile container">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="container main-content">
        {flash && (
          <div
            className={`alert ${flash.type === 'success' ? 'alert-success' : 'alert-error'}`}
            role="alert"
          >
            {flash.message}
            <button type="button" className="alert-dismiss" onClick={clearFlash} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
