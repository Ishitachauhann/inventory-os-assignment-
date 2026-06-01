import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

const emptyForm = { full_name: '', email: '', phone: '' };

function validateCustomer(form) {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address';
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  return errors;
}

export default function Customers() {
  const { showSuccess, showError } = useApp();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    return api
      .getCustomers()
      .then(setCustomers)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateCustomer(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    try {
      await api.createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      showSuccess('Customer created successfully');
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.deleteCustomer(id);
      showSuccess('Customer deleted');
      await load();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : '+ Add customer'}
        </button>
      </div>

      {showForm && (
        <form className="card form-grid cols-2" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ gridColumn: '1 / -1', margin: 0, fontSize: '1.1rem' }}>
            New customer
          </h2>
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input
              id="full_name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            {errors.full_name && <p className="error-text">{errors.full_name}</p>}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary">
              Create customer
            </button>
          </div>
        </form>
      )}

      <div className="card">
        {loading ? (
          <p className="empty-state">Loading customers…</p>
        ) : customers.length === 0 ? (
          <p className="empty-state">No customers yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.full_name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>
                      <button type="button" className="btn btn-danger" onClick={() => handleDelete(c.id)}>
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
