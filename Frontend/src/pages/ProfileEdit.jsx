import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '',
    university: '',
    major: '',
    hourlyRate: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(user._id || user.id);
      const profile = response.data.user;
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        university: profile.university || '',
        major: profile.major || '',
        hourlyRate: profile.hourlyRate || 0,
      });
    } catch (err) {
      setError('Failed to load profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'hourlyRate' ? parseFloat(value) || 0 : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      await userAPI.updateProfile(user._id, formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: 'var(--bg-light)',
      padding: '2rem',
    },
    content: {
      maxWidth: '600px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-light)',
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '2rem',
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
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontWeight: '600',
      color: 'var(--text-dark)',
      fontSize: '0.95rem',
    },
    input: {
      padding: '0.8rem 1rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    textarea: {
      padding: '0.8rem 1rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'all 0.3s ease',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    submitButton: {
      flex: 1,
      padding: '0.9rem',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    cancelButton: {
      flex: 1,
      padding: '0.9rem',
      backgroundColor: '#e5e7eb',
      color: 'var(--text-dark)',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
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
    hint: {
      fontSize: '0.85rem',
      color: 'var(--text-gray)',
      marginTop: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>✏️ Edit Profile</h1>
            <p style={styles.subtitle}>Update your profile information</p>
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && <div style={styles.successMessage}>{success}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                style={styles.input}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                name="bio"
                style={styles.textarea}
                placeholder="Tell students about yourself..."
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
              />
              <div style={styles.hint}>Write a compelling bio to attract more clients</div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>University</label>
              <input
                type="text"
                name="university"
                style={styles.input}
                placeholder="e.g., Stanford University"
                value={formData.university}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Major/Field of Study</label>
              <input
                type="text"
                name="major"
                style={styles.input}
                placeholder="e.g., Computer Science"
                value={formData.major}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {user?.role === 'expert' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Hourly Rate (USD)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  style={styles.input}
                  placeholder="25"
                  step="0.50"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div style={styles.hint}>Set your hourly rate for potential clients</div>
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#d1d5db')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#e5e7eb')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-dark)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary-blue)')}
              >
                {loading ? '🔄 Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
