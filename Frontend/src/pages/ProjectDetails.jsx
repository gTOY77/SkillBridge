import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI, bidAPI } from '../services/api'; 
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';

const ProjectDetails = () => {
  const { id } = useParams(); 
  const { user } = useAuth();
  const { socket } = useMessages();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidForm, setBidForm] = useState({
    bidAmount: '',
    proposedTimeline: '',
    message: '',
    costBreakdown: '',
    relevantExperience: '',
    projectApproach: ''
  });
  const [error, setError] = useState('');

  const fetchProjectAndBids = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjectById(id);
      
      // Handle response structure correctly
      const projectData = response.data.project || response.data;
      setProject(projectData);

      // Fetch bids if user is client (owner) or expert
      if (user) {
        const bidsRes = await bidAPI.getProjectBids(id);
        setBids(bidsRes.data.data);
      }
    } catch (err) {
      console.error("Could not fetch project details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectAndBids();
    }
  }, [id, user]);

  useEffect(() => {
    if (socket && id) {
      socket.emit('joinProject', id);
      
      const handleBidCountUpdate = ({ projectId }) => {
        if (projectId === id) {
          console.log("Real-time bid count update received");
          // Re-fetch project details to get updated count
          projectAPI.getProjectById(id).then(res => {
            const updatedProject = res.data.project || res.data;
            setProject(updatedProject);
          });
        }
      };

      socket.on('bidCountUpdate', handleBidCountUpdate);
      return () => socket.off('bidCountUpdate', handleBidCountUpdate);
    }
  }, [socket, id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingBid(true);
      setError('');
      
      const response = await bidAPI.placeBid(id, bidForm);
      
      if (response.data.success) {
        // Emit socket event for real-time notification to CLIENT
        if (socket) {
          const notificationData = {
            type: 'new_bid',
            title: 'New Bid Received',
            content: `A new bid of $${bidForm.bidAmount} has been placed on your project: ${project.title}`,
            link: `/projects/${id}`,
            senderId: user._id,
            data: { projectId: id, bidAmount: bidForm.bidAmount }
          };

          socket.emit('newBid', {
            recipientId: project.createdBy._id || project.createdBy,
            notification: notificationData,
            projectId: id
          });

          // ALSO notify the EXPERT themselves (for multi-tab synchronization)
          socket.emit('newBid', {
            recipientId: user._id,
            notification: {
              ...notificationData,
              title: 'Bid Submitted',
              content: `You successfully placed a bid of $${bidForm.bidAmount} on: ${project.title}`
            },
            projectId: id
          });
        }
        
        setShowBidModal(false);
        // Refresh project data and bids
        await fetchProjectAndBids();
        alert('Bid placed successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleSelectBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to award the project to this expert?')) return;
    
    try {
      const response = await bidAPI.selectBid(bidId);
      if (response.data.success) {
        const selectedBid = bids.find(b => b._id === bidId);
        
        // Emit socket event
        if (socket) {
          socket.emit('bidSelected', {
            recipientId: selectedBid.expertId._id || selectedBid.expertId,
            notification: {
              type: 'bid_selected',
              title: 'Bid Selected!',
              content: `Congratulations! Your bid has been selected for the project: ${project.title}`,
              link: `/projects/${id}`,
              data: { 
                projectId: id, 
                bidId: bidId,
                budget: project.budget 
              }
            }
          });
        }
        
        // Refresh data
        const projRes = await projectAPI.getProjectById(id);
        setProject(projRes.data.project || projRes.data);
        const bidsRes = await bidAPI.getProjectBids(id);
        setBids(bidsRes.data.data);
        alert('Project awarded successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error selecting bid');
    }
  };

  const styles = {
    // ... existing styles ...
    container: { minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8fafc', padding: '3rem 2rem' },
    card: { maxWidth: '900px', margin: '2rem auto', backgroundColor: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    backLink: { color: '#0d47a1', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' },
    category: { display: 'inline-block', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '2.2rem', color: '#1e293b', margin: '0 0 0.5rem 0' },
    idText: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
    budget: { fontSize: '2rem', color: '#16a34a', fontWeight: 'bold', margin: 0 },
    description: { fontSize: '1.1rem', color: '#475569', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap' },
    metaRow: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.95rem' },
    bidButton: { width: '100%', padding: '1rem', backgroundColor: '#0d47a1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '0.3rem 0.8rem',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontWeight: '600',
      backgroundColor: status === 'open' ? '#dcfce7' : '#fee2e2',
      color: status === 'open' ? '#166534' : '#991b1b',
      textTransform: 'capitalize'
    }),
    modal: {
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
    },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' },
    input: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' },
    textarea: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', outline: 'none' },
    bidsSection: { marginTop: '3rem', borderTop: '2px solid #f1f5f9', paddingTop: '2rem' },
    bidCard: { padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '1rem', position: 'relative' },
    selectButton: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
  };

  // While waiting for the backend to respond
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '3rem' }}>
          🔄 Loading exact project details...
        </div>
      </div>
    );
  }

  // 3. FALLBACK: If project doesn't exist in DB (Old Dummy Projects)
  if (!project) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link to="/projects" style={styles.backLink}>← Back to Projects</Link>
          <div style={styles.card}>
            <div style={styles.fallbackCenter}>
              <h1 style={{ color: '#1e293b', marginBottom: '1rem' }}>Welcome to project details</h1>
              <p>This is either an old test project or the details could not be found in the database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link to="/projects" style={styles.backLink}>← Back to Projects</Link>
        
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={styles.category}>{project.category || 'Uncategorized'}</div>
            <div style={styles.statusBadge(project.status)}>{project.status}</div>
          </div>
          
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>{project.title}</h1>
              <p style={styles.idText}>Project ID: {project._id}</p>
            </div>
            <div style={styles.budget}>${project.budget}</div>
          </div>

          <div style={styles.description}>
            {project.description}
          </div>

          <div style={styles.metaRow}>
            <div><strong>Posted By:</strong> {project.createdBy?.name || 'User'}</div>
            <div><strong>Current Bids:</strong> {project.bidCount || 0}</div>
            <div><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</div>
          </div>

          {user?.role === 'expert' && project.status === 'open' && (
            <button 
              style={styles.bidButton} 
              onClick={() => setShowBidModal(true)}
              disabled={bids.some(b => b.expertId._id === user._id)}
            >
              {bids.some(b => b.expertId._id === user._id) ? 'Bid Already Submitted' : 'Submit a Bid'}
            </button>
          )}

          {/* Bids List for Client (Project Owner) */}
          {user?._id === (project.createdBy._id || project.createdBy) && (
            <div style={styles.bidsSection}>
              <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Project Bids ({bids.length})</h2>
              {bids.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No bids received yet.</p>
              ) : (
                bids.map((bid) => (
                  <div key={bid._id} style={styles.bidCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0d47a1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {bid.expertId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{bid.expertId.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>⭐ {bid.expertId.rating || 0} ({bid.expertId.totalReviews || 0} reviews)</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>${bid.bidAmount}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{bid.proposedTimeline}</div>
                      </div>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem' }}>{bid.message}</p>
                    
                    {project.status === 'open' && (
                      <button 
                        style={styles.selectButton}
                        onClick={() => handleSelectBid(bid._id)}
                      >
                        Select Expert
                      </button>
                    )}
                    {bid.status === 'selected' && (
                      <div style={{ color: '#16a34a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ✓ Selected Expert
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bid Submission Modal */}
      {showBidModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Submit Your Bid</h2>
              <button style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowBidModal(false)}>×</button>
            </div>
            
            {error && <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleBidSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bid Amount ($)</label>
                <input 
                  type="number" 
                  style={styles.input} 
                  required 
                  value={bidForm.bidAmount}
                  onChange={(e) => setBidForm({...bidForm, bidAmount: e.target.value})}
                  max={project.budget * 1.5}
                />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>Budget: up to ${project.budget}</p>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Proposed Timeline</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  placeholder="e.g., 3 days, 1 week" 
                  required 
                  value={bidForm.proposedTimeline}
                  onChange={(e) => setBidForm({...bidForm, proposedTimeline: e.target.value})}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Bid Message / Pitch</label>
                <textarea 
                  style={styles.textarea} 
                  placeholder="Explain why you are the best fit for this project..." 
                  required
                  value={bidForm.message}
                  onChange={(e) => setBidForm({...bidForm, message: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                style={{...styles.bidButton, opacity: submittingBid ? 0.7 : 1}}
                disabled={submittingBid}
              >
                {submittingBid ? 'Submitting...' : 'Submit Bid'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;