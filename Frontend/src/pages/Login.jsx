import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // We use axios directly here to handle the 2-step process

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState(''); // Stores the OTP code
  const [showOTP, setShowOTP] = useState(false); // Controls which screen to show
  
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  // STEP 1: Verify Password & Send Email
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (res.data.requiresOTP) {
        setSuccess('Password accepted! OTP sent to your email.');
        setShowOTP(true); // Switch to the OTP screen!
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Redirect to Dashboard
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccess('');

    if (!otp) {
      setValidationError('Please enter the OTP sent to your email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-login-otp', {
        email: formData.email,
        otp: otp
      });

      if (res.data.success) {
        setSuccess('Verification successful! Redirecting...');
        
        // Save the token and user data so your Context picks it up
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const userRole = res.data.user.role;

        // Route them to the correct dashboard based on their role!
        setTimeout(() => {
          if (userRole === 'Admin' || userRole === 'admin') {
            window.location.href = '/admin-dashboard';
          } else if (userRole === 'Expert' || userRole === 'expert') {
            window.location.href = '/expert-dashboard';
          } else {
            window.location.href = '/client-dashboard';
          }
        }, 1500);
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
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
      marginBottom: '1rem',
    },
    successMessage: {
      padding: '0.75rem 1rem',
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderRadius: '8px',
      fontSize: '0.9rem',
      border: '1px solid #bbf7d0',
      marginBottom: '1rem',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        
        {/* Toggle the header text based on which step we are on */}
        <div style={styles.header}>
          <h2 style={styles.title}>{!showOTP ? "Welcome Back" : "Two-Step Verification"}</h2>
          <p style={styles.subtitle}>
            {!showOTP ? "Log in to your SkillBridge account" : "Check your email for the 6-digit code"}
          </p>
        </div>

        {validationError && <div style={styles.errorMessage}>{validationError}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        {/* STEP 1: The Email/Password Form */}
        {!showOTP ? (
          <form style={styles.form} onSubmit={handleLoginSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
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
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              disabled={loading}
            >
              {loading ? '🔄 Checking...' : 'Login'}
            </button>
          </form>
        ) : (
          
          /* STEP 2: The OTP Verification Form */
          <form style={styles.form} onSubmit={handleOTPSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Verification Code (OTP)</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                style={{...styles.input, textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px'}}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                maxLength="6"
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.button, backgroundColor: 'var(--primary-dark)', ...(loading ? styles.buttonDisabled : {}) }}
              disabled={loading}
            >
              {loading ? '🔄 Verifying...' : 'Verify & Enter Dashboard'}
            </button>
          </form>
        )}

        {!showOTP && (
          <p style={styles.footer}>
            Don't have an account?
            <Link to="/register" style={styles.footerLink}>
              Sign up here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;