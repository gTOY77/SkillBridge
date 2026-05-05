import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, bidAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { socket } = useMessages();
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // Payment Simulation State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProjectForPayment, setSelectedProjectForPayment] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Select Method, 2: Details, 3: Processing, 4: Success
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvc: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

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
      fetchNotifications();
      fetchTransactionHistory();
    }
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        
        // Real-time Dashboard Updates
        if (notif.type === 'project_update' && notif.data?.status === 'completed') {
          // Increment completed projects and decrement active
          setStats(prev => ({
            ...prev,
            activeProjects: Math.max(0, prev.activeProjects - 1),
            completedProjects: prev.completedProjects + 1
          }));
          
          // Refresh projects list to update UI
          fetchProjects();
        } else if (notif.type === 'payment_completed') {
          // Refresh transaction history when payment is confirmed
          fetchTransactionHistory();
        } else {
          fetchProjects(); // Generic refresh for other updates
        }
      });
      return () => socket.off('notification');
    }
  }, [socket]);

  const fetchTransactionHistory = async () => {
    try {
      const response = await paymentAPI.getHistory();
      setTransactions(response.data.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await bidAPI.getNotifications();
      setNotifications(response.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

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
    }
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentStep(3);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await paymentAPI.processPayment({
        projectId: selectedProjectForPayment._id,
        paymentMethod,
        cardDetails
      });

      if (response.data.success) {
        setPaymentStep(4);
        // Notify expert via socket
        if (socket) {
          socket.emit('projectCompleted', { // Reusing projectCompleted or specialized payment event
            recipientId: selectedProjectForPayment.assignedTo?._id || selectedProjectForPayment.assignedTo,
            notification: {
              type: 'payment_received',
              title: 'Payment Confirmed',
              content: `You received $${selectedProjectForPayment.budget} for "${selectedProjectForPayment.title}"`,
              link: '/dashboard',
              data: { amount: selectedProjectForPayment.budget }
            }
          });
        }
        fetchProjects(); // Refresh stats
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment simulation failed');
      setPaymentStep(2);
    } finally {
      setIsProcessing(false);
    }
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

        {/* Payment History Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>💰 Payment History</div>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', 
            boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)'
          }}>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-gray)' }}>
                No payments made yet. Compensate your experts once projects are completed.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>DATE</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>PROJECT</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>EXPERT</th>
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
                          {txn.expertId?.name || 'Unknown Expert'}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '700', color: '#b91c1c' }}>
                          -${txn.amount}
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
                    <Link 
                      to={`/projects/${project._id}`}
                      style={{ ...styles.button, flex: 1, fontSize: '0.9rem', textAlign: 'center' }}
                    >
                      👥 {project.bidCount || 0} Bids / View Details
                    </Link>
                    {project.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedProjectForPayment(project);
                          setPaymentStep(1);
                          setShowPaymentModal(true);
                        }}
                        style={{ ...styles.button, backgroundColor: '#16a34a', flex: 1, fontSize: '0.9rem' }}
                      >
                        💳 Pay Expert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Simulation Modal */}
        {showPaymentModal && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              backgroundColor: '#fff', padding: '2.5rem', borderRadius: '16px', 
              width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}>
              {paymentStep === 1 && (
                <div>
                  <h2 style={{ marginBottom: '0.5rem' }}>Secure Payment</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                    Select a payment method to compensate <strong>{selectedProjectForPayment?.assignedTo?.name || 'the expert'}</strong> for "<strong>{selectedProjectForPayment?.title}</strong>".
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {['Credit Card', 'PayPal', 'Bank Transfer', 'Digital Wallet'].map(method => (
                      <button
                        key={method}
                        onClick={() => {
                          setPaymentMethod(method);
                          setPaymentStep(2);
                        }}
                        style={{
                          padding: '1.2rem', borderRadius: '12px', border: '2px solid #e2e8f0',
                          backgroundColor: '#fff', textAlign: 'left', cursor: 'pointer',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      >
                        <span style={{ fontWeight: '600' }}>{method}</span>
                        <span>→</span>
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    style={{ ...styles.button, ...styles.secondaryButton, width: '100%', marginTop: '1.5rem' }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {paymentStep === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button onClick={() => setPaymentStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
                    <h2 style={{ margin: 0 }}>{paymentMethod} Details</h2>
                  </div>
                  
                  <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Amount to Pay:</span>
                      <span style={{ fontWeight: '700', color: '#166534' }}>${selectedProjectForPayment?.budget}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Includes simulated processing fees ($0.00)</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                      type="text" placeholder="Card Number (Simulated)" 
                      style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      value={cardDetails.cardNumber}
                      onChange={e => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input 
                        type="text" placeholder="MM/YY" 
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <input 
                        type="text" placeholder="CVC" 
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                    </div>
                    <input 
                      type="email" placeholder="Billing Email" 
                      style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      value={cardDetails.email}
                      onChange={e => setCardDetails({...cardDetails, email: e.target.value})}
                    />
                  </div>

                  <button 
                    onClick={handleProcessPayment}
                    style={{ ...styles.button, width: '100%', marginTop: '2rem', height: '50px' }}
                  >
                    Confirm & Pay ${selectedProjectForPayment?.budget}
                  </button>
                </div>
              )}

              {paymentStep === 3 && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ 
                    width: '60px', height: '60px', border: '4px solid #f3f3f3', 
                    borderTop: '4px solid var(--primary-blue)', borderRadius: '50%',
                    animation: 'spin 1s linear infinite', margin: '0 auto 2rem'
                  }} />
                  <h2>Processing Payment...</h2>
                  <p style={{ color: '#64748b' }}>Verifying simulated transaction with the university gateway.</p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {paymentStep === 4 && (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ 
                    fontSize: '4rem', color: '#166534', marginBottom: '1.5rem',
                    backgroundColor: '#dcfce7', width: '100px', height: '100px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 1.5rem'
                  }}>✓</div>
                  <h2 style={{ color: '#166534' }}>Payment Successful!</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                    The expert has been notified and their earnings have been updated.
                  </p>
                  <div style={{ 
                    textAlign: 'left', backgroundColor: '#f8fafc', padding: '1rem', 
                    borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem' 
                  }}>
                    <div><strong>Transaction ID:</strong> SIM-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                    <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                    <div><strong>Method:</strong> {paymentMethod}</div>
                  </div>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    style={{ ...styles.button, width: '100%' }}
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
