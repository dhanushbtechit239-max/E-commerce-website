import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../api/services';
import { FiTrash2, FiUser, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try { const r = await getAllUsers(); setUsers(r.data.users || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await deleteUser(id); toast.success('User deleted.'); setDeleteId(null); load(); }
    catch { toast.error('Failed to delete user.'); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>Users</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{users.length} registered users</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading...</div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: u.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${u.role === 'admin' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 999, padding: '0.2rem 0.6rem', color: u.role === 'admin' ? '#818cf8' : '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                        {u.role === 'admin' ? <FiShield size={11} /> : <FiUser size={11} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.825rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {u.role !== 'admin' && (
                        <button onClick={() => setDeleteId(u.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center' }}>
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ padding: '2rem', maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <FiTrash2 size={40} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Delete User?</h3>
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

export default ManageUsers;
