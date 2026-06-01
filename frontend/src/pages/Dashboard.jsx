import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

export default function Dashboard() {
  const { showError } = useApp();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboard()
      .then(setSummary)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  }, [showError]);

  if (loading) return <p className="empty-state">Loading dashboard…</p>;
  if (!summary) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{summary.total_products}</span>
          <Link to="/products" className="stat-link">
            Manage products →
          </Link>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{summary.total_customers}</span>
          <Link to="/customers" className="stat-link">
            Manage customers →
          </Link>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{summary.total_orders}</span>
          <Link to="/orders" className="stat-link">
            View orders →
          </Link>
        </div>
      </div>

      <section className="card low-stock-section">
        <h2>Low stock products</h2>
        <p className="section-hint">Products with 10 or fewer units in stock</p>
        {summary.low_stock_products.length === 0 ? (
          <p className="empty-state">All products are well stocked.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {summary.low_stock_products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>
                      <span className="badge badge-warning">{p.quantity_in_stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
