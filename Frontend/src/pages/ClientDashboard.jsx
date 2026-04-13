import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBids: 0,
  });

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      if (!userId) {
        setLoading(false);
        return;
      }
      const response = await projectAPI.getProjects(1, 100);
      const userProjects = response.data.projects.filter(p => 
        String(p.createdBy?._id) === String(userId)
      );
      
      setProjects(userProjects);
      
      // Calculate stats
      const totalBids = userProjects.reduce((sum, p) => sum + (p.bids?.length || 0), 0);
      const activeProjects = userProjects.filter(p => p.status === 'open' || p.status === 'in-progress').length;
      const completedProjects = userProjects.filter(p => p.status === 'completed').length;

      setStats({
        totalProjects: userProjects.length,
        activeProjects,
        completedProjects,
        totalBids,
      });
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
      padding: '2rem',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      fontWeight: '700',
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
    },
    welcomeTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
    },
    userRole: {
      fontSize: '0.9rem',
      color: 'var(--text-gray)',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
    },
    button: {
      padding: '0.7rem 1.2rem',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease',
    },
    secondaryButton: {
      backgroundColor: '#e5e7eb',
      color: 'var(--text-dark)',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow)',
      textAlign: 'center',
      border: '1px solid var(--border-light)',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: 'var(--primary-blue)',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: 'var(--text-gray)',
      fontSize: '0.95rem',
      fontWeight: '500',
    },
    section: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    projectsGrid: {
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
    projectHeader: {
      marginBottom: '1rem',
    },
    projectCategory: {
      display: 'inline-block',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      padding: '0.3rem 0.8rem',
      borderRadius: '6px',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    projectTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '0.5rem',
    },
    projectDescription: {
      color: 'var(--text-gray)',
      fontSize: '0.9rem',
      marginBottom: '1rem',
      flex: 1,
    },
    projectMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9rem',
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--border-light)',
    },
    projectBudget: {
      fontWeight: '700',
      color: 'var(--success-green)',
    },
    statusBadge: {
      padding: '0.3rem 0.8rem',
      borderRadius: '6px',
      fontSize: '0.8rem',
      fontWeight: '600',
    },
    statusOpen: {
      backgroundColor: '#dbeafe',
      color: '#0369a1',
    },
    statusInProgress: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    statusCompleted: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 2rem',
      backgroundColor: '#fff',
      borderRadius: '12px',
      color: 'var(--text-gray)',
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      fontSize: '1.1rem',
      color: 'var(--text-gray)',
    },
    errorMessage: {
      padding: '1rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #fecaca',
    },
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open':
        return styles.statusOpen;
      case 'in-progress':
        return styles.statusInProgress;
      case 'completed':
        return styles.statusCompleted;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div style={styles.headerText}>
              <div style={styles.welcomeTitle}>Welcome back, {user?.name}! 👋</div>
              <div style={styles.userRole}>📚 Client • Manage your projects</div>
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <Link to="/create-project" style={styles.button} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-dark)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-blue)'}>
              ➕ Post Project
            </Link>
            <Link to="/profile/edit" style={{ ...styles.button, ...styles.secondaryButton }}>
              ✏️ Edit Profile
            </Link>
          </div>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalProjects}</div>
            <div style={styles.statLabel}>Total Projects</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.activeProjects}</div>
            <div style={styles.statLabel}>Active Projects</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.completedProjects}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalBids}</div>
            <div style={styles.statLabel}>Bids Received</div>
          </div>
        </div>

        {/* Projects Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>📋 Your Projects</span>
            <Link to="/" style={{ ...styles.button, fontSize: '0.9rem' }}>
              Browse Experts
            </Link>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>🔄 Loading your projects...</div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3>No projects yet</h3>
              <p>Post your first project to connect with expert students</p>
              <button style={styles.button}>
                ➕ Post Your First Project
              </button>
            </div>
          ) : (
            <div style={styles.projectsGrid}>
              {projects.map((project) => (
                <div key={project._id} style={styles.projectCard}>
                  <div style={styles.projectHeader}>
                    <div style={styles.projectCategory}>{project.category}</div>
                    <h3 style={styles.projectTitle}>{project.title}</h3>
                  </div>

                  <p style={styles.projectDescription}>{project.description}</p>

                  <div style={styles.projectMeta}>
                    <span style={styles.projectBudget}>💰 ${project.budget}</span>
                    <span style={{ ...styles.statusBadge, ...getStatusStyle(project.status) }}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ ...styles.button, flex: 1, fontSize: '0.9rem' }}>
                      👥 {project.bids?.length || 0} Bids
                    </button>
                    <button style={{ ...styles.button, ...styles.secondaryButton, flex: 1, fontSize: '0.9rem' }}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
