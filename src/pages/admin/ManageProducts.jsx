import { useState, useEffect } from 'react';
import { fetchProducts } from '../../api/productService';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  if (loading) return <div style={{ color: '#f1f5f9' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Products</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Name', 'Price', 'Category', 'Stock'].map((h) => (
                <th key={h} style={{ color: '#94a3b8', textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ color: '#f1f5f9', padding: '0.75rem 1rem' }}>{p.name}</td>
                <td style={{ color: '#818cf8', padding: '0.75rem 1rem' }}>${p.price}</td>
                <td style={{ color: '#94a3b8', padding: '0.75rem 1rem' }}>{p.category}</td>
                <td style={{ color: '#94a3b8', padding: '0.75rem 1rem' }}>{p.stock ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
