import { useEffect, useState } from 'react';
import { CouponAPI } from '../../api/endpoints';
import { Spinner, ErrorAlert, SuccessAlert } from '../../components/UI';
import AdminLayout from './AdminLayout';

const emptyForm = { code: '', discountPercent: '', isActive: true, expiryDate: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => CouponAPI.list().then(setCoupons).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({ code: c.code, discountPercent: c.discountPercent, isActive: c.isActive, expiryDate: c.expiryDate.slice(0, 10) });
    setShowForm(true);
  };
  const startCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const dto = { ...form, discountPercent: Number(form.discountPercent) };
      if (editingId) {
        await CouponAPI.update(editingId, dto);
        setSuccess('Coupon updated.');
      } else {
        await CouponAPI.create(dto);
        setSuccess('Coupon created.');
      }
      cancelForm();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await CouponAPI.remove(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AdminLayout title="Coupons">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">All Coupons</h4>
        <button className="btn btn-primary" onClick={showForm ? cancelForm : startCreate}>
          <i className={`bi ${showForm ? 'bi-x-circle' : 'bi-plus-circle'}`}></i> {showForm ? 'Cancel' : 'Add New Coupon'}
        </button>
      </div>

      <ErrorAlert message={error} />
      <SuccessAlert message={success} />

      {showForm && (
        <div className="card stat-card mb-4">
          <div className="card-body">
            <h6 className="mb-3">{editingId ? 'Edit coupon' : 'New coupon'}</h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Code</label>
                  <input required className="form-control" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Discount %</label>
                  <input required type="number" min="0" max="100" className="form-control" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Expiry date</label>
                  <input required type="date" className="form-control" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Active</label>
                  <select className="form-control" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary mt-3" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create coupon'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="card stat-card">
        <div className="card-body">
          {!coupons && <Spinner label="Loading coupons…" />}
          {coupons && (
            <table className="table table-hover">
              <thead className="table-dark"><tr><th>Code</th><th>Discount</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td>{c.code}</td>
                    <td>{c.discountPercent}%</td>
                    <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                    <td>{c.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-1" onClick={() => startEdit(c)}><i className="bi bi-pencil-square"></i> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><i className="bi bi-trash"></i> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
