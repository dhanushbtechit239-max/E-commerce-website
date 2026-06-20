import { useEffect, useState, useRef } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/productService';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', category: '', stock: '', isFeatured: false, image: null };

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  const load = async () => {
    try { const r = await fetchProducts({ limit: 100 }); setProducts(r.data.products || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category || '', stock: p.stock, isFeatured: p.isFeatured || false, image: null });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price and stock are required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k !== 'image' && v !== null && v !== '') fd.append(k, v); });
      if (form.image) fd.append('image', form.image);
      if (editing) { await updateProduct(editing.id, fd); toast.success('Product updated!'); }
      else { await createProduct(fd); toast.success('Product created!'); }
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteProduct(id); toast.success('Product deleted.'); setDeleteId(null); load(); }
    catch { toast.error('Failed to delete product.'); }
  };

  const fmt = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>Products</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{products.length} products</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading...</div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50'} alt={p.name}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50'; }} />
                        <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#818cf8', fontSize: '0.825rem' }}>{p.category}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#f1f5f9', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{fmt(p.price)}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ color: p.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {p.isFeatured ? <FiCheck size={16} color="#10b981" /> : <FiX size={16} color="#334155" />}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(p)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}><FiEdit2 size={13} /></button>
                        <button onClick={() => setDeleteId(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 520, padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1.2rem' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[['name','Product Name','text'],['price','Price (₹)','number'],['category','Category','text'],['stock','Stock Quantity','number']].map(([n,p,t]) => (
                <div key={n}>
                  <label className="input-label">{p}</label>
                  <input name={n} type={t} value={form[n]} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} placeholder={p} className="input" step={n==='price'?'0.01':undefined} />
                </div>
              ))}
              <div>
                <label className="input-label">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Product description" rows={3} className="input" style={{ resize: 'vertical', minHeight: 70 }} />
              </div>
              <div>
                <label className="input-label">Product Image</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))}
                  style={{ display: 'none' }} />
                <button type="button" onClick={() => fileRef.current.click()} className="btn btn-secondary btn-sm">
                  {form.image ? form.image.name : 'Choose Image'}
                </button>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#94a3b8', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ accentColor: '#6366f1', width: 16, height: 16 }} />
                Featured Product
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ padding: '2rem', maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <FiTrash2 size={40} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Product?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: 10, padding: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
