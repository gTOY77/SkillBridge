import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ExpertDashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  const [availableSkills] = useState([
    'Web Development', 'Mobile App Development', 'UI/UX Design', 'Python',
    'JavaScript', 'React', 'Node.js', 'Database Design', 'Machine Learning',
    'Data Analysis', 'Cloud Computing', 'DevOps', 'Cybersecurity',
    'Game Development', 'IoT Development',
  ]);

  const [stats, setStats] = useState({
    totalSkills: 0,
    bidsMade: 0,
    projectsWon: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        setLoading(true);
        setError('');
        
        let currentProfile = user;
        const profileResponse = await userAPI.getProfile(userId);
        
        if (profileResponse?.data?.user) {
          currentProfile = profileResponse.data.user;
          setProfile(currentProfile);
        }

        // Fetch all projects to find ones the expert has bid on
        const projectResponse = await projectAPI.getProjects(1, 100);
        const allProjects = projectResponse.data.projects || [];

        // Find bids made by this expert
        const bidsToProjects = [];
        allProjects.forEach(project => {
          project.bids?.forEach(bid => {
            if (String(bid.userId) === String(userId)) {
              bidsToProjects.push(project);
            }
          });
        });

        setProjects(bidsToProjects);
        setSkills(currentProfile?.skills || []);

        // Calculate stats
        setStats({
          totalSkills: currentProfile?.skills?.length || 0,
          bidsMade: bidsToProjects.length,
          projectsWon: bidsToProjects.filter(p => p.assignedTo?._id === userId).length,
          totalEarnings: bidsToProjects
            .filter(p => p.assignedTo?._id === userId)
            .reduce((sum, p) => sum + (p.budget || 0), 0),
        });

      } catch (err) {
        setError('Failed to load data');
        console.error('Dashboard Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id, user?.id]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const userId = user?._id || user?.id;
      const updatedUser = await userAPI.addSkill(userId, { skillName: newSkill });
      setSkills(updatedUser.data.skills || []);
      setNewSkill('');
      setStats(prev => ({ ...prev, totalSkills: (prev.totalSkills + 1) }));
    } catch (err) {
      setError('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      const userId = user?._id || user?.id;
      const updatedUser = await userAPI.removeSkill(userId, skillName);
      setSkills(updatedUser.data.skills || []);
      setStats(prev => ({ ...prev, totalSkills: Math.max(0, prev.totalSkills - 1) }));
    } catch (err) {
      setError('Failed to remove skill');
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
              <div style={styles.welcomeTitle}>Welcome back, {profile?.name || user?.name}! 👋</div>
              <div style={styles.userRole}>⭐ Expert • ${profile?.hourlyRate || user?.hourlyRate || '0'}/hour</div>
              <div style={styles.ratingDisplay}>
                ⭐ 4.8 rating • 12 projects completed
              </div>
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <Link to="/profile/edit" style={{ ...styles.button, ...styles.secondaryButton }}>
              ✏️ Edit Profile
            </Link>
          </div>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalSkills}</div>
            <div style={styles.statLabel}>Skills Listed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.bidsMade}</div>
            <div style={styles.statLabel}>Bids Made</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.projectsWon}</div>
            <div style={styles.statLabel}>Projects Won</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>${stats.totalEarnings}</div>
            <div style={styles.statLabel}>Earnings</div>
          </div>
        </div>

        {/* Skills Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🎯 Your Skills</div>
          <div style={styles.skillsContainer}>
            <div style={styles.skillInputGroup}>
              <input
                type="text"
                style={styles.skillInput}
                placeholder="Add a new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                list="skill-suggestions"
              />
              <button
                style={styles.addButton}
                onClick={handleAddSkill}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-purple)'}
              >
                Add ➕
              </button>
              <datalist id="skill-suggestions">
                {availableSkills.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>

            {skills.length === 0 ? (
              <div style={{ color: 'var(--text-gray)', marginBottom: '1rem' }}>
                No skills added yet. Add your first skill to get started!
              </div>
            ) : (
              <div style={styles.skillsList}>
                {skills.map((skill) => (
                  <div key={skill} style={styles.skillTag}>
                    {skill}
                    <button
                      style={styles.removeSkillBtn}
                      onClick={() => handleRemoveSkill(skill)}
                      title="Remove skill"
                      onMouseEnter={(e) => e.target.style.color = '#666'}
                      onMouseLeave={(e) => e.target.style.color = '#000'}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.suggestedSkills}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-gray)', width: '100%' }}>
                💡 Suggested skills:
              </span>
              {availableSkills
                .filter(s => !skills.includes(s))
                .slice(0, 5)
                .map((skill) => (
                  <button
                    key={skill}
                    style={styles.skillSuggestion}
                    onClick={() => setNewSkill(skill)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--accent-purple)';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.color = 'var(--text-dark)';
                    }}
                  >
                    {skill}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Active Bids Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>📊 Your Active Bids</div>

          {loading ? (
            <div style={styles.loadingContainer}>🔄 Loading your bids...</div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎯</div>
              <h3>No active bids yet</h3>
              <p>Browse available projects and submit your bids</p>
              <button style={styles.button}>
                🔍 Browse Projects
              </button>
            </div>
          ) : (
            <div style={styles.projectsGrid}>
              {projects.map((project) => (
                <div key={project._id} style={styles.projectCard}>
                  <div style={styles.projectTitle}>{project.title}</div>
                  <div style={styles.projectClient}>
                    From: {project.createdBy?.name || 'Unknown Client'}
                  </div>
                  <div style={styles.projectBudget}>💰 ${project.budget}</div>
                  <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Skills: {project.skillsRequired?.join(', ') || 'N/A'}
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

// ==========================================
// STYLES
// Extracted outside the component to prevent 
// re-initialization on every render
// ==========================================
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
    backgroundColor: 'var(--accent-purple)',
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
  ratingDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.3rem',
    fontSize: '0.95rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    padding: '0.7rem 1.2rem',
    backgroundColor: 'var(--accent-purple)',
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
    color: 'var(--accent-purple)',
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
  },
  skillsContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border-light)',
  },
  skillInputGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  skillInput: {
    flex: 1,
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    fontSize: '0.95rem',
  },
  addButton: {
    padding: '0.8rem 1.2rem',
    backgroundColor: 'var(--accent-purple)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.7rem',
  },
  skillTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#eef2ff',
    color: '#3730a3',
    padding: '0.6rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid #c7d2fe',
  },
  removeSkillBtn: {
    background: 'none',
    border: 'none',
    color: '#000',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s ease',
  },
  suggestedSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-light)',
  },
  skillSuggestion: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    color: 'var(--text-dark)',
    border: '1px solid var(--border-light)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
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
  },
  projectTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '0.5rem',
  },
  projectClient: {
    color: 'var(--text-gray)',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  projectBudget: {
    fontWeight: '700',
    color: 'var(--accent-purple)',
    fontSize: '1.1rem',
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

export default ExpertDashboard;