import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function OrderDetail() {
  const { id } = useParams();
  const { showError } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrder(id)
      .then(setOrder)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  }, [id, showError]);

  if (loading) return <p className="empty-state">Loading order…</p>;
  if (!order) return <p className="empty-state">Order not found.</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Order #{order.id}</h1>
        <Link to="/orders" className="btn btn-ghost">
          ← Back to orders
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <dl className="order-meta">
          <div>
            <dt>Customer</dt>
            <dd>{order.customer_name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{order.customer_email}</dd>
          </div>
          <div>
            <dt>Total amount</dt>
            <dd style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              ${Number(order.total_amount).toFixed(2)}
            </dd>
          </div>
          <div>
            <dt>Placed at</dt>
            <dd>{new Date(order.created_at).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Line items</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.product_sku}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unit_price).toFixed(2)}</td>
                  <td>${Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .order-meta {
          display: grid;
          gap: 1rem;
          margin: 0;
        }
        .order-meta dt {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .order-meta dd {
          margin: 0.15rem 0 0;
        }
        @media (min-width: 640px) {
          .order-meta {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
