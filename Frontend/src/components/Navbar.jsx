import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      {/* You can eventually replace this text with a real logo image! */}
      <h2 style={styles.logo}>SkillBridge</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        {/* Updated Text and Link Destination 👇 */}
        <li><Link to="/experts" style={styles.link}>Find Experts</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
        <li><Link to="/register" style={styles.button}>Sign Up</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' },
  logo: { color: '#004aad', fontWeight: 'bold' }, // Changed to match the blue hero banner!
  navLinks: { listStyle: 'none', display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#333', fontWeight: '500' },
  button: { textDecoration: 'none', color: '#fff', backgroundColor: '#00cc66', padding: '0.5rem 1rem', borderRadius: '5px', fontWeight: 'bold' } // Changed to match the green search button!
};

export default Navbar;