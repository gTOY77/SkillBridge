import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: 'Assignment Help', icon: '📝', value: 'Assignment Help' },
    { id: 2, name: 'Peer Tutoring', icon: '🧑‍🏫', value: 'Peer Tutoring' },
    { id: 3, name: 'Project Collaboration', icon: '🤝', value: 'Project Collaboration' },
    { id: 4, name: 'Exam Prep', icon: '📚', value: 'Exam Prep' },
  ];

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectAPI.getProjects(1, 6);
      let filtered = response.data.projects;
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setProjects(filtered);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: 'var(--bg-light)',
    },
    hero: {
      background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark) 100%)',
      color: '#fff',
      padding: '4rem 2rem',
      textAlign: 'center',
      marginBottom: '3rem',
      boxShadow: 'var(--shadow-lg)',
    },
    heroTitle: {
      fontSize: '2.8rem',
      fontWeight: '800',
      marginBottom: '1rem',
      letterSpacing: '-0.5px',
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '2.5rem',
      opacity: 0.95,
      maxWidth: '600px',
      margin: '0 auto 2.5rem',
    },
    searchContainer: {
      display: 'flex',
      gap: '0.5rem',
      maxWidth: '500px',
      margin: '0 auto',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    searchInput: {
      flex: 1,
      minWidth: '250px',
      padding: '0.9rem 1.2rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    searchButton: {
      padding: '0.9rem 1.5rem',
      backgroundColor: 'var(--success-green)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    categoriesSection: {
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    card: {
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      textAlign: 'center',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-lg)',
      borderColor: 'var(--primary-blue)',
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    projectsSection: {
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    projectsTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    filterButtonGroup: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '0.6rem 1rem',
      backgroundColor: selectedCategory === null ? 'var(--primary-blue)' : '#e5e7eb',
      color: selectedCategory === null ? '#fff' : 'var(--text-dark)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    projectGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    projectCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border-light)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    projectCategory: {
      display: 'inline-block',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      padding: '0.3rem 0.8rem',
      borderRadius: '6px',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginBottom: '0.8rem',
      width: 'fit-content',
    },
    projectTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '0.5rem',
    },
    projectDescription: {
      color: 'var(--text-gray)',
      fontSize: '0.95rem',
      marginBottom: '1rem',
      flex: 1,
    },
    projectMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid var(--border-light)',
      fontSize: '0.9rem',
    },
    projectBudget: {
      fontWeight: '700',
      color: 'var(--success-green)',
      fontSize: '1.1rem',
    },
    projectLink: {
      display: 'inline-block',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      padding: '0.7rem 1.2rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      textAlign: 'center',
      cursor: 'pointer',
      border: 'none',
      width: '100%',
      transition: 'all 0.3s ease',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      fontSize: '1.1rem',
      color: 'var(--text-gray)',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 2rem',
      color: 'var(--text-gray)',
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    errorMessage: {
      padding: '1rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #fecaca',
    },
    ctaButton: {
      display: 'inline-block',
      backgroundColor: 'var(--success-green)',
      color: '#fff',
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      marginTop: '1rem',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>🚀 Your Campus Skill Marketplace</h1>
        <p style={styles.heroSubtitle}>
          Get help with assignments and projects from expert students, or offer your skills and earn money
        </p>
        {!user && (
          <div style={styles.searchContainer}>
            <p style={{ width: '100%', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: '500' }}>
              🚀 <Link to="/register" style={{ color: '#fff', textDecoration: 'underline', fontWeight: '700' }}>Sign up</Link> now to explore projects and start earning!
            </p>
          </div>
        )}
      </header>

      {/* Categories Section */}
      <section style={styles.categoriesSection}>
        <h2 style={styles.sectionTitle}>Popular Categories</h2>
        <div style={styles.grid}>
          {categories.map((category) => (
            <div
              key={category.id}
              style={styles.card}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onClick={() => setSelectedCategory(selectedCategory === category.value ? null : category.value)}
            >
              <div style={styles.icon}>{category.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section style={styles.projectsSection}>
        <div style={styles.projectsTitle}>
          <span>
            {selectedCategory ? `${selectedCategory} Projects` : 'Latest Projects'}
          </span>
          <div style={styles.filterButtonGroup}>
            <button
              style={{
                ...styles.filterButton,
                backgroundColor: selectedCategory === null ? 'var(--primary-blue)' : '#e5e7eb',
                color: selectedCategory === null ? '#fff' : 'var(--text-dark)',
              }}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                style={{
                  ...styles.filterButton,
                  backgroundColor: selectedCategory === cat.value ? 'var(--primary-blue)' : '#e5e7eb',
                  color: selectedCategory === cat.value ? '#fff' : 'var(--text-dark)',
                }}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div style={styles.loadingContainer}>🔄 Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📭</div>
            <h3>No projects found</h3>
            <p>Be the first to create a project!</p>
            {user && user.role === 'client' && (
              <Link to="/create-project" style={styles.ctaButton}>
                Create Project
              </Link>
            )}
          </div>
        ) : (
          <div style={styles.projectGrid}>
            {projects.map((project) => (
              <div key={project._id} style={styles.projectCard}>
                <div style={styles.projectCategory}>{project.category}</div>
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <p style={styles.projectDescription}>{project.description}</p>

                <div style={styles.projectMeta}>
                  <span>
                    💰 <span style={styles.projectBudget}>${project.budget}</span>
                  </span>
                  <span style={{ color: 'var(--text-gray)' }}>
                    👥 {project.bids?.length || 0} bids
                  </span>
                </div>

                {user && user.role === 'expert' ? (
                  <Link to={`/projects/${project._id}`} style={styles.projectLink}>
                    Place Bid on Project
                  </Link>
                ) : user ? (
                  <Link to={`/projects/${project._id}`} style={styles.projectLink}>
                    View Project Details
                  </Link>
                ) : (
                  <Link to="/login" style={styles.projectLink}>
                    Login to View
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
