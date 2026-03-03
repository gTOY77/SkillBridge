import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Join SkillBridge</h2>
        <p style={styles.subtitle}>Create an account to hire peers or offer your skills</p>
        
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" placeholder="John Doe" style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>University Email</label>
            <input type="email" placeholder="student@university.edu" style={styles.input} required />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>I want to...</label>
            <select style={styles.input} required>
              <option value="client">Hire students for help (Client)</option>
              <option value="freelancer">Offer my skills (Expert)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="••••••••" style={styles.input} required />
          </div>
          
          <button type="submit" style={styles.button}>Create Account</button>
        </form>
        
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

// Reusing the exact same styles as the Login page for consistency!
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f4f9' },
  formCard: { backgroundColor: 'white', padding: '3rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { color: '#004aad', marginBottom: '0.5rem' },
  subtitle: { color: '#666', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { textAlign: 'left' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: 'white' },
  button: { padding: '0.8rem', backgroundColor: '#004aad', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
  footerText: { marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' },
  link: { color: '#00cc66', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;