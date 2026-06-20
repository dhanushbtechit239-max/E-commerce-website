import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    color: isActive ? '#818cf8' : '#94a3b8',
    background: isActive ? 'rgba(129,140,248,0.1)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.95rem',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#0f0f1a' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          Admin Panel
        </h2>
        <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/admin/products" style={linkStyle}>Products</NavLink>
        <NavLink to="/admin/orders" style={linkStyle}>Orders</NavLink>
        <NavLink to="/admin/users" style={linkStyle}>Users</NavLink>
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '0.6rem 1rem', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
