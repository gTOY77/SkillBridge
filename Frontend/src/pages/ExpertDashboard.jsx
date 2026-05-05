import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, projectAPI, bidAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';

const ExpertDashboard = () => {
  const { user } = useAuth();
  const { socket } = useMessages();
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(user);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [transactions, setTransactions] = useState([]);
  
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

  const [submitting, setSubmitting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedProjectForComplete, setSelectedProjectForComplete] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const fetchData = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      setError('');
      
      // Fetch Notifications
      const notifRes = await bidAPI.getNotifications();
      setNotifications(notifRes.data.data);

      // Fetch Expert's Bids
      const bidsRes = await bidAPI.getExpertBids();
      const expertBids = bidsRes.data.data || [];

      // Fetch Transaction History
      const transRes = await paymentAPI.getHistory();
      const transactionHistory = transRes.data.data || [];
      setTransactions(transactionHistory);

      let currentProfile = user;
      const profileResponse = await userAPI.getProfile(userId);
      
      if (profileResponse?.data?.user) {
        currentProfile = profileResponse.data.user;
        setProfile(currentProfile);
      }

      // Map bids to project objects for the UI
      const bidsToProjects = expertBids.map(bid => ({
        ...bid.projectId,
        bidStatus: bid.status,
        bidAmount: bid.bidAmount
      })).filter(p => p !== null);

      setProjects(bidsToProjects);
      setSkills(currentProfile?.skills || []);

      // Calculate stats
      const totalEarnings = transactionHistory
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalSkills: currentProfile?.skills?.length || 0,
        bidsMade: expertBids.length,
        projectsWon: expertBids.filter(b => b.status === 'selected').length,
        totalEarnings: totalEarnings,
      });

    } catch (err) {
      setError('Failed to load data');
      console.error('Dashboard Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id, user?.id]);

  useEffect(() => {
    if (socket) {
      const handleNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        
        // Granular Real-time Stat Updates
        if (notif.type === 'new_bid' && String(notif.senderId) === String(user._id)) {
          setStats(prev => ({
            ...prev,
            bidsMade: prev.bidsMade + 1
          }));
        }

        if (notif.type === 'bid_selected') {
          // If the notification data contains the award amount
          const awardAmount = notif.data?.budget ? parseFloat(notif.data.budget) : 0;
          setStats(prev => ({
            ...prev,
            projectsWon: prev.projectsWon + 1
          }));
          
          // Also fetch projects to update the list without reload
          fetchData();
        }

        if (notif.type === 'payment_received') {
          const amount = notif.data?.amount ? parseFloat(notif.data.amount) : 0;
          setStats(prev => ({
            ...prev,
            totalEarnings: prev.totalEarnings + amount
          }));
          fetchData(); // Refresh history and profile
        }
      };

      socket.on('notification', handleNotification);
      return () => socket.off('notification', handleNotification);
    }
  }, [socket, user?._id]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    // ... rest of handleAddSkill logic ...
  };

  const handleCompleteProject = async () => {
    if (!selectedProjectForComplete) return;
    
    try {
      setSubmitting(true);
      const response = await projectAPI.completeProject(selectedProjectForComplete._id, completionNotes);
      
        if (response.data.success) {
        if (socket) {
          socket.emit('projectCompleted', {
            recipientId: selectedProjectForComplete.createdBy._id || selectedProjectForComplete.createdBy,
            notification: {
              type: 'project_update',
              title: 'Project Completed',
              content: `Your project "${selectedProjectForComplete.title}" has been marked as completed by the expert.`,
              link: `/projects/${selectedProjectForComplete._id}`,
              senderId: user?._id || user?.id,
              data: { 
                projectId: selectedProjectForComplete._id.toString(), 
                status: 'completed' 
              }
            }
          });
        }
        
        setShowCompleteModal(false);
        setCompletionNotes('');
        setSelectedProjectForComplete(null);
        fetchData();
        alert('Project marked as completed!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error completing project');
    } finally {
      setSubmitting(false);
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

        {/* Real-time Notifications */}
        {notifications.length > 0 && (
          <div style={styles.notifSection}>
            <h3 style={{ marginBottom: '1rem' }}>🔔 Recent Notifications</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {notifications.slice(0, 5).map((notif, idx) => (
                <Link key={idx} to={notif.link || '#'} style={styles.notifItem}>
                  {!notif.isRead && <div style={styles.notifBadge} />}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{notif.content}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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

        {/* Transaction History Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>💰 Recent Earnings</div>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', 
            boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)'
          }}>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-gray)' }}>
                No payment history yet. Complete projects to start earning!
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>DATE</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>PROJECT</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>CLIENT</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>AMOUNT</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((txn) => (
                      <tr key={txn._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                          {txn.projectId?.title || 'Unknown Project'}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                          {txn.clientId?.name || 'Unknown Client'}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '700', color: '#166534' }}>
                          +${txn.amount}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700',
                            backgroundColor: txn.status === 'completed' ? '#dcfce7' : '#fee2e2',
                            color: txn.status === 'completed' ? '#166534' : '#b91c1c'
                          }}>
                            {txn.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>📋 Your Projects & Bids</div>

          {loading ? (
            <div style={styles.loadingContainer}>🔄 Loading your projects...</div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎯</div>
              <h3>No activity yet</h3>
              <p>Browse available projects and submit your bids</p>
              <Link to="/projects" style={styles.button}>
                🔍 Browse Projects
              </Link>
            </div>
          ) : (
            <div style={styles.projectsGrid}>
              {projects.map((project) => (
                <div key={project._id} style={styles.projectCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={styles.projectCategory}>{project.category}</div>
                    <div style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      backgroundColor: project.status === 'completed' ? '#dcfce7' : project.status === 'in-progress' ? '#fef3c7' : '#f3f4f6',
                      color: project.status === 'completed' ? '#166534' : project.status === 'in-progress' ? '#92400e' : '#64748b'
                    }}>
                      {project.status.toUpperCase()}
                    </div>
                  </div>
                  <div style={styles.projectTitle}>{project.title}</div>
                  <div style={styles.projectClient}>
                    Client: {project.createdBy?.name || 'Unknown'}
                  </div>
                  <div style={styles.projectBudget}>💰 Budget: ${project.budget}</div>
                  <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginTop: '0.5rem', flex: 1 }}>
                    {project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}
                  </div>
                  
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <Link to={`/projects/${project._id}`} style={{ ...styles.button, flex: 1, fontSize: '0.85rem', textAlign: 'center' }}>
                      View
                    </Link>
                    {project.status === 'in-progress' && 
                     String(project.assignedTo?._id || project.assignedTo) === String(user?._id || user?.id) && (
                      <button 
                        onClick={() => {
                          setSelectedProjectForComplete(project);
                          setShowCompleteModal(true);
                        }}
                        style={{ ...styles.button, backgroundColor: '#16a34a', flex: 1, fontSize: '0.85rem' }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completion Modal */}
        {showCompleteModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Mark as Completed</h2>
              <p style={{ color: 'var(--text-gray)', marginTop: '1rem' }}>
                Are you sure you want to mark "<strong>{selectedProjectForComplete?.title}</strong>" as completed? 
                This will notify the client.
              </p>
              
              <textarea 
                style={styles.textarea}
                placeholder="Optional: Add completion notes or remarks for the client..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={() => setShowCompleteModal(false)}
                  style={{ ...styles.button, ...styles.secondaryButton, flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCompleteProject}
                  disabled={submitting}
                  style={{ ...styles.button, backgroundColor: '#16a34a', flex: 1, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Updating...' : 'Confirm Completion'}
                </button>
              </div>
            </div>
          </div>
        )}
        
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
  notifSection: {
    marginBottom: '2rem',
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
  },
  notifItem: {
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'inherit',
  },
  notifBadge: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-blue)',
  },
  statLabel: {
    color: 'var(--text-gray)',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  modal: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px'
  },
  textarea: {
    width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', outline: 'none', marginTop: '1rem'
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