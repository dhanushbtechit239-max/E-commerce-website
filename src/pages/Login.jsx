import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem' }}>
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Sign In
        </h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: '#0f0f1a', color: '#f1f5f9', fontSize: '0.95rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: '#0f0f1a', color: '#f1f5f9', fontSize: '0.95rem' }}
          />
          <button
            type="submit"
            style={{ padding: '0.75rem', borderRadius: '8px', background: '#818cf8', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
        </form>
        <p style={{ color: '#64748b', textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
