const Spinner = ({ size = 40, text = '' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '2rem' }}>
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(99,102,241,0.2)`,
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    {text && <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{text}</span>}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
