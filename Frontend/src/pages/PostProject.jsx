import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectAPI } from '../services/api'; // Assuming you have this set up!
import { useAuth } from '../context/AuthContext';

const PostProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State to hold the form data
  const [formData, setFormData] = useState({
    title: '',
    category: 'Assignment Help',
    description: '',
    budget: '',
    deadline: ''
  });

  const categories = ['Assignment Help', 'Peer Tutoring', 'Project Collaboration', 'Exam Prep'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send the data to your backend
      await projectAPI.createProject(formData); 
      // If successful, redirect them to the projects page to see their new post!
      navigate('/projects'); 
    } catch (err) {
      setError('Failed to post the project. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { minHeight: 'calc(100vh - 80px)', backgroundColor: '#f3f4f6', padding: '3rem 2rem' },
    formCard: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { fontSize: '2rem', color: '#1e293b', marginBottom: '1.5rem', textAlign: 'center' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#475569' },
    input: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', minHeight: '150px', boxSizing: 'border-box' },
    submitButton: { width: '100%', padding: '1rem', backgroundColor: '#0d47a1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' },
    error: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }
  };

  // Prevent logged-out users from posting
  if (!user) {
    return (
      <div style={{...styles.container, textAlign: 'center'}}>
        <h2>You must be logged in to post a project.</h2>
        <Link to="/login" style={{color: '#0d47a1'}}>Go to Login</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>🚀 Post a New Project</h1>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={styles.input} required placeholder="e.g., Need help with React frontend" />
          </div>

          <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
            <div style={{flex: 1}}>
              <label style={styles.label}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} style={styles.input} required>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div style={{flex: 1}}>
              <label style={styles.label}>Budget ($)</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleChange} style={styles.input} required placeholder="e.g., 50" min="5" />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Detailed Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={styles.textarea} required placeholder="Describe what you need help with, requirements, etc..." />
          </div>

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Posting...' : 'Post Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProject;