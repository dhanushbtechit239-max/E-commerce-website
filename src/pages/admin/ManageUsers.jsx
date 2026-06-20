import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/users');
        setUsers(data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div style={{ color: '#f1f5f9' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Users</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Name', 'Email', 'Role'].map((h) => (
                <th key={h} style={{ color: '#94a3b8', textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ color: '#f1f5f9', padding: '0.75rem 1rem' }}>{u.name}</td>
                <td style={{ color: '#94a3b8', padding: '0.75rem 1rem' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: u.role === 'admin' ? 'rgba(129,140,248,0.15)' : 'rgba(100,116,139,0.15)', color: u.role === 'admin' ? '#818cf8' : '#94a3b8', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
