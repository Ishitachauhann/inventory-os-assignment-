import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

const emptyForm = { name: '', sku: '', price: '', quantity_in_stock: '' };

function validateProduct(form, isEdit) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!isEdit && !form.sku.trim()) errors.sku = 'SKU is required';
  if (form.sku.trim() && form.sku.length > 64) errors.sku = 'SKU too long';
  const price = parseFloat(form.price);
  if (!form.price && form.price !== 0) errors.price = 'Price is required';
  else if (isNaN(price) || price <= 0) errors.price = 'Price must be greater than 0';
  const qty = parseInt(form.quantity_in_stock, 10);
  if (form.quantity_in_stock === '' || form.quantity_in_stock === null)
    errors.quantity_in_stock = 'Quantity is required';
  else if (isNaN(qty) || qty < 0) errors.quantity_in_stock = 'Quantity cannot be negative';
  return errors;
}

export default function Products() {
  const { showSuccess, showError } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    return api
      .getProducts()
      .then(setProducts)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      price: String(p.price),
      quantity_in_stock: String(p.quantity_in_stock),
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProduct(form, !!editingId);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity_in_stock: parseInt(form.quantity_in_stock, 10),
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        showSuccess('Product updated successfully');
      } else {
        await api.createProduct(payload);
        showSuccess('Product created successfully');
      }
      resetForm();
      await load();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showSuccess('Product deleted');
      await load();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add product'}
        </button>
      </div>

      {showForm && (
        <form className="card form-grid cols-2" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ gridColumn: '1 / -1', margin: 0, fontSize: '1.1rem' }}>
            {editingId ? 'Edit product' : 'New product'}
          </h2>
          <div className="field">
            <label htmlFor="name">Product name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="sku">SKU / code</label>
            <input
              id="sku"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
            {errors.sku && <p className="error-text">{errors.sku}</p>}
          </div>
          <div className="field">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>
          <div className="field">
            <label htmlFor="qty">Quantity in stock</label>
            <input
              id="qty"
              type="number"
              min="0"
              value={form.quantity_in_stock}
              onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })}
            />
            {errors.quantity_in_stock && <p className="error-text">{errors.quantity_in_stock}</p>}
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save changes' : 'Create product'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card">
        {loading ? (
          <p className="empty-state">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="empty-state">No products yet. Add your first product above.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${p.quantity_in_stock <= 10 ? 'badge-warning' : 'badge-ok'}`}
                      >
                        {p.quantity_in_stock}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-ghost" onClick={() => startEdit(p)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => handleDelete(p.id)}>
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
