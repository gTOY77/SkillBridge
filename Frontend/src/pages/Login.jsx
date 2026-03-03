import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Log in to your SkillBridge account</p>
        
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>University Email</label>
            <input type="email" placeholder="student@university.edu" style={styles.input} required />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="••••••••" style={styles.input} required />
          </div>
          
          <button type="submit" style={styles.button}>Login</button>
        </form>
        
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f4f9' },
  formCard: { backgroundColor: 'white', padding: '3rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { color: '#004aad', marginBottom: '0.5rem' },
  subtitle: { color: '#666', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  inputGroup: { textAlign: 'left' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' },
  button: { padding: '0.8rem', backgroundColor: '#00cc66', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
  footerText: { marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' },
  link: { color: '#004aad', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;