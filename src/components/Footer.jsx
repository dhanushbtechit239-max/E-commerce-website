const Footer = () => (
  <footer style={{
    background: '#0f0f1a',
    color: '#64748b',
    textAlign: 'center',
    padding: '1.5rem 1rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
  }}>
    <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
  </footer>
);

export default Footer;
