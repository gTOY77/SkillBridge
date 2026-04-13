import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BrowseProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 1, name: 'Assignment Help', icon: '📝', value: 'Assignment Help' },
    { id: 2, name: 'Peer Tutoring', icon: '🧑‍🏫', value: 'Peer Tutoring' },
    { id: 3, name: 'Project Collaboration', icon: '🤝', value: 'Project Collaboration' },
    { id: 4, name: 'Exam Prep', icon: '📚', value: 'Exam Prep' },
  ];

  useEffect(() => {
    setCurrentPage(1);
    fetchProjects(1);
  }, [selectedCategory]);

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await projectAPI.getProjects(page, 12);
      let filtered = response.data.projects;
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setProjects(filtered);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProjects(newPage);
    window.scrollTo(0, 0);
  };

  const styles = {
    container: {
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: 'var(--bg-light)',
    },
    header: {
      background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark) 100%)',
      color: '#fff',
      padding: '3rem 2rem',
      textAlign: 'center',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-lg)',
    },
    headerTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      letterSpacing: '-0.5px',
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.95,
      maxWidth: '600px',
      margin: '0 auto',
    },
    mainContent: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    filtersSection: {
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
      backgroundColor: '#e5e7eb',
      color: 'var(--text-dark)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    filterButtonActive: {
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
    },
    projectsSection: {
      marginBottom: '2rem',
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
    projectCreator: {
      color: 'var(--text-gray)',
      fontSize: '0.85rem',
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
      minHeight: '300px',
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
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '2rem',
    },
    paginationButton: {
      padding: '0.6rem 0.8rem',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    paginationButtonDisabled: {
      backgroundColor: '#d1d5db',
      cursor: 'not-allowed',
    },
    paginationInfo: {
      color: 'var(--text-gray)',
      fontSize: '0.95rem',
      padding: '0 1rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>📋 Browse All Projects</h1>
        <p style={styles.headerSubtitle}>
          Explore available projects and find opportunities that match your skills
        </p>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Filters */}
        <div style={styles.filtersSection}>
          <div style={styles.filterButtonGroup}>
            <button
              style={{
                ...styles.filterButton,
                ...(selectedCategory === null && styles.filterButtonActive),
              }}
              onClick={() => setSelectedCategory(null)}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                style={{
                  ...styles.filterButton,
                  ...(selectedCategory === cat.value && styles.filterButtonActive),
                }}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Projects Section */}
        <div style={styles.projectsSection}>
          {loading ? (
            <div style={styles.loadingContainer}>🔄 Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>📭</div>
              <h3>No projects found</h3>
              <p>Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <>
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
                      <span style={styles.projectCreator}>
                        👤 {project.createdBy?.name || 'Anonymous'}
                      </span>
                    </div>

                    <div style={styles.projectMeta}>
                      <span style={{ color: 'var(--text-gray)' }}>
                        👥 {project.bids?.length || 0} bids
                      </span>
                    </div>

                    {user && user.role === 'expert' ? (
                      <button style={styles.projectLink}>
                        Place Bid
                      </button>
                    ) : user ? (
                      <button style={styles.projectLink} disabled>
                        View Details
                      </button>
                    ) : (
                      <Link to="/login" style={styles.projectLink}>
                        Login to Bid
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.paginationContainer}>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === 1 && styles.paginationButtonDisabled),
                    }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span style={styles.paginationInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === totalPages && styles.paginationButtonDisabled),
                    }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProjects;
