import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState('');

  // 👇 This was the missing function causing the blank screen! 👇
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData);
      
      setSuccess('Account created! Redirecting to login to verify your email...');
      
      // Change '/' to '/login' so they are forced to go through 2FA!
      setTimeout(() => navigate('/login'), 2000); 
      
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Registration failed');
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
      gap: '1.2rem',
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
      backgroundColor: '#fff',
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
    roleInfo: {
      fontSize: '0.85rem',
      color: 'var(--text-gray)',
      marginTop: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>Join SkillBridge</h2>
          <p style={styles.subtitle}>Create an account and start sharing your skills!</p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {validationError && <div style={styles.errorMessage}>{validationError}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

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
            <label style={styles.label}>I want to...</label>
            <select
              name="role"
              style={styles.input}
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="client">📚 Hire students for help (Client)</option>
              <option value="expert">💼 Offer my skills (Expert)</option>
            </select>
            <div style={styles.roleInfo}>
              {formData.role === 'client' ? 'Post projects and find skilled students' : 'Showcase your skills and earn money'}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
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
            {loading ? '🔄 Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?
          <Link to="/login" style={styles.footerLink}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;