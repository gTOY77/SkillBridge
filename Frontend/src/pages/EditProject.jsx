import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectAPI } from '../services/api'; 
import { useAuth } from '../context/AuthContext';

const EditProject = () => {
  const { id } = useParams(); // Gets the project ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Assignment Help',
    description: '',
    budget: '',
    deadline: ''
  });

  const categories = ['Assignment Help', 'Peer Tutoring', 'Project Collaboration', 'Exam Prep'];

  // 1. Fetch the existing project data when the page loads
  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Assuming you have a getProject method in your api.js
        const response = await projectAPI.getProject(id); 
        const project = response.data.project || response.data;
        
        // Fill the form with the fetched data
        setFormData({
          title: project.title || '',
          category: project.category || 'Assignment Help',
          description: project.description || '',
          budget: project.budget || '',
          // Formatting the date so the HTML input can read it
          deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ''
        });
      } catch (err) {
        setError('Failed to load project details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit the updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Assuming you have an updateProject method in your api.js
      await projectAPI.updateProject(id, formData); 
      navigate('/dashboard'); // Send them back to their dashboard!
    } catch (err) {
      setError('Failed to update the project. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
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
    submitButton: { width: '100%', padding: '1rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' },
    error: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }
  };

  if (!user) return <div style={styles.container}>Please log in.</div>;
  if (loading) return <div style={styles.container}><h2 style={{textAlign: 'center'}}>Loading project...</h2></div>;

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>✏️ Edit Project</h1>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={styles.input} required />
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
              <input type="number" name="budget" value={formData.budget} onChange={handleChange} style={styles.input} required min="5" />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Detailed Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={styles.textarea} required />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/dashboard" style={{ flex: 1, padding: '1rem', backgroundColor: '#e2e8f0', color: '#475569', textAlign: 'center', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Cancel
            </Link>
            <button type="submit" style={{ ...styles.submitButton, flex: 2 }} disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;