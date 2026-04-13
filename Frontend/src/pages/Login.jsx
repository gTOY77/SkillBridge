import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Login failed');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(0, 74, 173, 0.05), rgba(0, 204, 102, 0.05))',
    },
    formCard: {
      backgroundColor: '#fff',
      padding: '3rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-lg)',
      width: '100%',
      maxWidth: '420px',
      border: '1px solid var(--border-light)',
      animation: 'fadeIn 0.4s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: 'var(--primary-blue)',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: 'var(--text-gray)',
      fontSize: '0.95rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontWeight: '600',
      color: 'var(--text-dark)',
      fontSize: '0.9rem',
    },
    input: {
      padding: '0.8rem 1rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    button: {
      padding: '0.9rem',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      backgroundColor: 'var(--primary-dark)',
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      padding: '0.75rem 1rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '8px',
      fontSize: '0.9rem',
      border: '1px solid #fecaca',
    },
    successMessage: {
      padding: '0.75rem 1rem',
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderRadius: '8px',
      fontSize: '0.9rem',
      border: '1px solid #bbf7d0',
    },
    footer: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: 'var(--text-gray)',
    },
    footerLink: {
      color: 'var(--primary-blue)',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '0.25rem',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
      borderTop: '2px solid #fff',
      animation: 'spin 0.6s linear infinite',
      marginRight: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to your SkillBridge account</p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {validationError && <div style={styles.errorMessage}>{validationError}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@university.edu"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-dark)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary-blue)')}
          >
            {loading ? '🔄 Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?
          <Link to="/register" style={styles.footerLink}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;