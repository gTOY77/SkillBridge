import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Assignment Help',
    budget: '',
    deadline: '',
    skillsRequired: [{ name: '', level: 'intermediate' }],
  });

  const categories = [
    'Assignment Help',
    'Peer Tutoring',
    'Project Collaboration',
    'Exam Prep',
    'Other',
  ];

  const skillLevels = ['beginner', 'intermediate', 'expert'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...formData.skillsRequired];
    newSkills[index][field] = value;
    setFormData(prev => ({
      ...prev,
      skillsRequired: newSkills,
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: [...prev.skillsRequired, { name: '', level: 'intermediate' }],
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Project description is required');
      return;
    }
    if (!formData.budget || formData.budget <= 0) {
      setError('Budget must be a positive number');
      return;
    }
    if (!formData.deadline) {
      setError('Deadline is required');
      return;
    }

    // Validate that deadline is in the future
    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate <= new Date()) {
      setError('Deadline must be in the future');
      return;
    }

    // Filter out empty skills
    const skills = formData.skillsRequired.filter(s => s.name.trim() !== '');

    try {
      setLoading(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: parseInt(formData.budget),
        deadline: formData.deadline,
        skillsRequired: skills,
      };

      await projectAPI.createProject(payload);
      setSuccessMessage('Project created successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create project';
      setError(message);
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
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '0.5rem',
    },
    headerSubtitle: {
      color: 'var(--text-gray)',
      fontSize: '1rem',
    },
    form: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border-light)',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: 'var(--text-dark)',
      fontSize: '0.95rem',
    },
    required: {
      color: '#ef4444',
      marginLeft: '0.2rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: 'var(--primary-blue)',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '120px',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      cursor: 'pointer',
    },
    skillsSection: {
      marginBottom: '1.5rem',
    },
    skillItem: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr 1fr auto',
      gap: '0.75rem',
      alignItems: 'end',
      marginBottom: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid var(--border-light)',
    },
    skillIndex: {
      fontSize: '0.9rem',
      color: 'var(--text-gray)',
      fontWeight: '600',
      paddingLeft: '0.5rem',
    },
    removeButton: {
      padding: '0.5rem 0.75rem',
      backgroundColor: '#ef4444',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.85rem',
      transition: 'all 0.3s ease',
    },
    addSkillButton: {
      padding: '0.6rem 1rem',
      backgroundColor: '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      marginTop: '0.5rem',
    },
    formActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
    },
    submitButton: {
      padding: '0.8rem 2rem',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cancelButton: {
      padding: '0.8rem 2rem',
      backgroundColor: '#e5e7eb',
      color: 'var(--text-dark)',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    errorMessage: {
      padding: '1rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #fecaca',
    },
    successMessage: {
      padding: '1rem',
      backgroundColor: '#d1fae5',
      color: '#065f46',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #a7f3d0',
    },
    twoColGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    },
    hint: {
      fontSize: '0.85rem',
      color: 'var(--text-gray)',
      marginTop: '0.3rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>➕ Create a New Project</h1>
          <p style={styles.headerSubtitle}>
            Post a project and get bids from expert students
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.errorMessage}>{error}</div>}
          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Project Title <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Data Science Assignment Help"
              style={styles.input}
              required
            />
            <p style={styles.hint}>A clear, descriptive title helps experts find your project</p>
          </div>

          {/* Category & Budget in 2 columns */}
          <div style={styles.twoColGrid}>
            {/* Category */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Category <span style={styles.required}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.select}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Budget ($) <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                style={styles.input}
                min="1"
                required
              />
            </div>
          </div>

          {/* Deadline */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Deadline <span style={styles.required}>*</span>
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <p style={styles.hint}>When do you need this project completed?</p>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Project Description <span style={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project in detail. What do you need? What are the requirements?"
              style={styles.textarea}
              required
            />
            <p style={styles.hint}>Be as detailed as possible to attract the right experts</p>
          </div>

          {/* Skills Required */}
          <div style={styles.skillsSection}>
            <label style={styles.label}>Skills Required (Optional)</label>
            {formData.skillsRequired.map((skill, index) => (
              <div key={index} style={styles.skillItem}>
                <div style={styles.skillIndex}>{index + 1}.</div>
                <input
                  type="text"
                  placeholder="Skill name (e.g., Python, SQL)"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  style={styles.input}
                />
                <select
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  style={styles.select}
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  style={styles.removeButton}
                  title="Remove skill"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              style={styles.addSkillButton}
            >
              + Add Another Skill
            </button>
          </div>

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-dark)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary-blue)')}
            >
              {loading ? '⏳ Creating...' : '✅ Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={styles.cancelButton}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#d1d5db')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#e5e7eb')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
