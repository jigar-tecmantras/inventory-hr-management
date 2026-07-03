import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const emptyForm = { name: '', quantity: '', description: '' };

export default function App() {
  const [inventories, setInventories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const total = useMemo(
    () => inventories.reduce((sum, item) => sum + Number(item.quantity), 0),
    [inventories]
  );

  useEffect(() => {
    fetchInventories();
  }, []);

  async function fetchInventories() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/inventories`);
      if (!response.ok) throw new Error('Unable to load inventory list');
      const data = await response.json();
      setInventories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name || form.quantity === '' || Number(form.quantity) < 0) {
      setError('Please provide a valid name and quantity.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/inventories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          quantity: Number(form.quantity),
          description: form.description.trim() || null
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to save inventory item');
      }

      setForm(emptyForm);
      fetchInventories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <header>
        <h1>Inventory</h1>
        <p>HR can add items and track quantities without any login.</p>
      </header>

      <section className="panel">
        <h2>Add inventory item</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Item name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g., Laptops"
              required
            />
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              placeholder="e.g., 10"
              required
            />
          </label>
          <label>
            Description (optional)
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows="3"
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Add inventory'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <h2>Items</h2>
        {loading ? (
          <p>Loading items…</p>
        ) : inventories.length === 0 ? (
          <p>No inventory recorded yet.</p>
        ) : (
          <ul>
            {inventories.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p className="desc">{item.description || '—'}</p>
                </div>
                <span className="qty">{item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
        <footer>
          <span>Total quantity</span>
          <strong>{total}</strong>
        </footer>
      </section>
    </div>
  );
}
