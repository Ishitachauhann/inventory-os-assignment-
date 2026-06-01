import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function Orders() {
  const { showSuccess, showError } = useApp();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [lineItems, setLineItems] = useState([{ product_id: '', quantity: '1' }]);
  const [formErrors, setFormErrors] = useState({});

  const load = useCallback(async () => {
    try {
      const [o, c, p] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getProducts(),
      ]);
      setOrders(o);
      setCustomers(c);
      setProducts(p);
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const addLine = () => {
    setLineItems([...lineItems, { product_id: '', quantity: '1' }]);
  };

  const updateLine = (index, field, value) => {
    const next = [...lineItems];
    next[index] = { ...next[index], [field]: value };
    setLineItems(next);
  };

  const removeLine = (index) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const validateOrderForm = () => {
    const errors = {};
    if (!customerId) errors.customer = 'Select a customer';
    const items = [];
    const seen = new Set();
    lineItems.forEach((line, i) => {
      if (!line.product_id) {
        errors[`line_${i}`] = 'Select a product';
        return;
      }
      const qty = parseInt(line.quantity, 10);
      if (!line.quantity || isNaN(qty) || qty < 1) {
        errors[`qty_${i}`] = 'Quantity must be at least 1';
        return;
      }
      if (seen.has(line.product_id)) {
        errors[`dup_${i}`] = 'Duplicate product in order';
        return;
      }
      seen.add(line.product_id);
      items.push({ product_id: parseInt(line.product_id, 10), quantity: qty });
    });
    if (items.length === 0) errors.items = 'Add at least one product';
    return { errors, items };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, items } = validateOrderForm();
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      await api.createOrder({
        customer_id: parseInt(customerId, 10),
        items,
      });
      showSuccess('Order created — stock updated automatically');
      setShowForm(false);
      setCustomerId('');
      setLineItems([{ product_id: '', quantity: '1' }]);
      setFormErrors({});
      await load();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel/delete this order? Stock will be restored.')) return;
    try {
      await api.deleteOrder(id);
      showSuccess('Order deleted and stock restored');
      await load();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
          disabled={customers.length === 0 || products.length === 0}
        >
          {showForm ? 'Cancel' : '+ Create order'}
        </button>
      </div>

      {(customers.length === 0 || products.length === 0) && (
        <p className="alert alert-error" style={{ marginBottom: '1rem' }}>
          Add at least one customer and one product before creating orders.
        </p>
      )}

      {showForm && (
        <form className="card form-grid" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>New order</h2>
          <div className="field">
            <label htmlFor="customer">Customer</label>
            <select
              id="customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.email})
                </option>
              ))}
            </select>
            {formErrors.customer && <p className="error-text">{formErrors.customer}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Products
            </label>
            {lineItems.map((line, i) => (
              <div key={i} className="order-line" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  value={line.product_id}
                  onChange={(e) => updateLine(i, 'product_id', e.target.value)}
                  style={{ flex: '2 1 180px' }}
                >
                  <option value="">Select product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (stock: {p.quantity_in_stock}) — ${Number(p.price).toFixed(2)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(i, 'quantity', e.target.value)}
                  style={{ flex: '0 1 80px' }}
                  placeholder="Qty"
                />
                <button type="button" className="btn btn-ghost" onClick={() => removeLine(i)}>
                  Remove
                </button>
                {(formErrors[`line_${i}`] || formErrors[`qty_${i}`] || formErrors[`dup_${i}`]) && (
                  <p className="error-text" style={{ width: '100%' }}>
                    {formErrors[`line_${i}`] || formErrors[`qty_${i}`] || formErrors[`dup_${i}`]}
                  </p>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-ghost" onClick={addLine} style={{ marginTop: '0.25rem' }}>
              + Add line item
            </button>
            {formErrors.items && <p className="error-text">{formErrors.items}</p>}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Total amount is calculated automatically by the server based on current product prices.
          </p>

          <button type="submit" className="btn btn-primary">
            Place order
          </button>
        </form>
      )}

      <div className="card">
        {loading ? (
          <p className="empty-state">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="empty-state">No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer_name || `Customer #${o.customer_id}`}</td>
                    <td>${Number(o.total_amount).toFixed(2)}</td>
                    <td>{new Date(o.created_at).toLocaleString()}</td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link to={`/orders/${o.id}`} className="btn btn-ghost">
                        Details
                      </Link>
                      <button type="button" className="btn btn-danger" onClick={() => handleDelete(o.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
