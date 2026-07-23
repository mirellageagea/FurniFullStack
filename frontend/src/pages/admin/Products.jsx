import { useEffect, useState } from 'react';
import { ProductAPI } from '../../api/endpoints';
import { Spinner, ErrorAlert, SuccessAlert } from '../../components/UI';
import { imageUrl } from '../../api/client';
import AdminLayout from './AdminLayout';

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', imageFile: null };

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => ProductAPI.list().then(setProducts).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, imageFile: null });
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
      const fd = new FormData();
      fd.append('Name', form.name);
      fd.append('Description', form.description);
      fd.append('Price', form.price);
      fd.append('Category', form.category);
      fd.append('Stock', form.stock);
      if (form.imageFile) fd.append('ImageFile', form.imageFile);

      if (editingId) {
        await ProductAPI.update(editingId, fd);
        setSuccess('Product updated.');
      } else {
        await ProductAPI.create(fd);
        setSuccess('Product created.');
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
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await ProductAPI.remove(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">All Products</h4>
        <button className="btn btn-primary" onClick={showForm ? cancelForm : startCreate}>
          <i className={`bi ${showForm ? 'bi-x-circle' : 'bi-plus-circle'}`}></i> {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      <ErrorAlert message={error} />
      <SuccessAlert message={success} />

      {showForm && (
        <div className="card stat-card mb-4">
          <div className="card-body">
            <h6 className="mb-3">{editingId ? 'Edit product' : 'New product'}</h6>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input required className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input required className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea required rows={3} className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price</label>
                  <input required type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input required type="number" min="0" className="form-control" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Image {editingId && '(optional)'}</label>
                  <input type="file" accept="image/*" className="form-control" onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })} />
                </div>
              </div>
              <button className="btn btn-primary mt-3" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create product'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card stat-card">
        <div className="card-body">
          {!products && <Spinner label="Loading products…" />}
          {products && (
            <table className="table table-hover">
              <thead className="table-dark">
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.imageUrl ? (
                        <img src={imageUrl(p.imageUrl)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>
                      {p.stock > 0 ? <span className="badge bg-success">{p.stock}</span> : <span className="badge bg-danger">Out of Stock</span>}
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm me-1" onClick={() => startEdit(p)}><i className="bi bi-pencil-square"></i> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><i className="bi bi-trash"></i> Delete</button>
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
