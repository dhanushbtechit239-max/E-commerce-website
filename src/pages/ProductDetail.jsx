import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { fetchProductById } from '../api/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await fetchProductById(id);
        setProduct(data);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ color: '#f1f5f9', textAlign: 'center', padding: '4rem' }}>Loading...</div>;
  if (error) return <div style={{ color: '#ef4444', textAlign: 'center', padding: '4rem' }}>{error}</div>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem', fontFamily: 'Inter, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        ← Back
      </button>
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', maxWidth: '380px', borderRadius: '12px', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ color: '#818cf8', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>${product.price}</p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>
          <button
            onClick={() => addItem(product._id)}
            style={{ padding: '0.75rem 2rem', background: '#818cf8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
