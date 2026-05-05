import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import { useMessages } from '../context/MessageContext';

const Experts = () => {
  const { user } = useAuth(); 
  const { openChat } = useMessages();
  const [reviews, setReviews] = useState([]); 
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchSkills, setSearchSkills] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
  const fetchExperts = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getAllExperts(page, 12);
      setExperts(response.data.experts);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Failed to load experts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedExpert) {
      axios.get(`http://localhost:5000/api/reviews/${selectedExpert._id}`)
        .then(res => setReviews(res.data.reviews))
        .catch(err => console.error("Error fetching reviews:", err));
    }
  }, [selectedExpert]);

  const handleSearch = async () => {
    if (!searchSkills.trim()) {
      if (currentPage === 1) {
        fetchExperts(1);
      } else {
        setCurrentPage(1);
      }
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await userAPI.searchExperts(searchSkills);
      setExperts(response.data.experts || []);
      setCurrentPage(1);
      setTotalPages(1); // For search, we don't have pagination yet
    } catch (err) {
      setError('Failed to search experts');
    } finally {
      setLoading(false);
    }
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
      marginBottom: '3rem',
    },
    headerTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '1rem',
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.95,
      marginBottom: '2rem',
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
      minWidth: '200px',
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
    },
    searchButton: {
      padding: '0.8rem 1.5rem',
      backgroundColor: 'var(--success-green)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    content: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
    expertCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border-light)',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    expertAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      margin: '0 auto 1rem',
      fontWeight: '700',
    },
    expertName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: 'var(--text-dark)',
      marginBottom: '0.3rem',
    },
    expertRole: {
      fontSize: '0.85rem',
      color: 'var(--text-gray)',
      marginBottom: '1rem',
      backgroundColor: 'var(--bg-gray)',
      padding: '0.3rem 0.8rem',
      borderRadius: '6px',
      display: 'inline-block',
    },
    expertRating: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.3rem',
      marginBottom: '0.8rem',
      fontSize: '0.95rem',
    },
    expertSkills: {
      marginBottom: '1rem',
      flex: 1,
    },
    skillTag: {
      display: 'inline-block',
      backgroundColor: 'var(--bg-gray)',
      color: 'var(--text-dark)',
      padding: '0.3rem 0.8rem',
      borderRadius: '6px',
      fontSize: '0.8rem',
      margin: '0.2rem',
      fontWeight: '500',
    },
    expertHourly: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: 'var(--success-green)',
      marginBottom: '1rem',
    },
    contactButton: {
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      padding: '0.8rem 1.2rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
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
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem',
    },
    modalContent: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      position: 'relative',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalClose: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: 'var(--text-dark)',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    modalAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: '700',
    },
    modalName: {
      fontSize: '1.6rem',
      fontWeight: '800',
      color: 'var(--text-dark)',
      margin: 0,
    },
    modalRole: {
      color: 'var(--text-gray)',
      fontSize: '0.95rem',
    },
    modalBody: {
      marginTop: '1rem',
      lineHeight: 1.6,
      color: 'var(--text-dark)',
    },
    modalSectionTitle: {
      fontSize: '1rem',
      fontWeight: '700',
      marginTop: '1.5rem',
      marginBottom: '0.75rem',
      color: 'var(--text-dark)',
    },
    modalActions: {
      marginTop: '1.75rem',
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    messageButton: {
      padding: '0.85rem 1.2rem',
      borderRadius: '8px',
      border: '1px solid var(--border-light)',
      backgroundColor: '#fff',
      color: 'var(--text-dark)',
      fontWeight: '700',
      cursor: 'pointer',
      flex: 1,
      minWidth: '140px',
      transition: 'all 0.3s ease',
    },
    messageButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    closeButton: {
      padding: '0.85rem 1.2rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      fontWeight: '700',
      cursor: 'pointer',
      flex: 1,
      minWidth: '140px',
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
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '2rem',
      paddingBottom: '2rem',
    },
    pageButton: {
      padding: '0.5rem 1rem',
      border: '1px solid var(--border-light)',
      backgroundColor: '#fff',
      color: 'var(--text-dark)',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    pageButtonActive: {
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      borderColor: 'var(--primary-blue)',
    },
    pageButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>💼 Find Expert Students</h1>
        <p style={styles.headerSubtitle}>Discover talented students ready to help with your projects</p>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by skills (e.g., Python, Math, Writing)"
            style={styles.searchInput}
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button style={styles.searchButton} onClick={handleSearch}>
            Search
          </button>
          <button style={{ ...styles.searchButton, backgroundColor: '#6b7280' }} onClick={() => { 
            if (currentPage === 1) {
              fetchExperts(1);
            } else {
              setCurrentPage(1);
            }
          }}>
            Refresh
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div style={styles.loadingContainer}>🔄 Loading experts...</div>
        ) : experts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>No experts found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {experts.map((expert) => (
              <div key={expert._id} style={styles.expertCard}>
                <div style={styles.expertAvatar}>
                  {expert.name.charAt(0).toUpperCase()}
                </div>

                <h3 style={styles.expertName}>{expert.name}</h3>

                <div style={styles.expertRole}>
                  💼 Expert Student
                </div>

                <div style={styles.expertRating}>
                  <span>⭐ {expert.rating || 0}</span>
                  <span style={{ color: 'var(--text-gray)' }}>
                    ({expert.totalReviews || 0} reviews)
                  </span>
                </div>

                {expert.skills && expert.skills.length > 0 && (
                  <div style={styles.expertSkills}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                      Skills:
                    </div>
                    <div>
                      {expert.skills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>
                          {typeof skill === 'string' ? skill : skill.name || skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {expert.hourlyRate > 0 && (
                  <div style={styles.expertHourly}>
                    ${expert.hourlyRate}/hour
                  </div>
                )}

                <button
                  style={styles.contactButton}
                  onClick={() => setSelectedExpert(expert)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
              }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === page ? styles.pageButtonActive : {}),
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
              }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {selectedExpert && (
          <div style={styles.modalOverlay} onClick={() => setSelectedExpert(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={styles.modalClose} onClick={() => setSelectedExpert(null)}>
                ×
              </button>
              
              <div style={styles.modalHeader}>
                <div style={styles.modalAvatar}>
                  {selectedExpert.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={styles.modalName}>{selectedExpert.name}</h2>
                  <div style={styles.modalRole}>Expert Student</div>
                  <div style={styles.expertRating}>
                    <span>⭐ {selectedExpert.rating || 0}</span>
                    <span style={{ color: 'var(--text-gray)' }}>
                      ({selectedExpert.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.modalSectionTitle}>About</div>
                <p>{selectedExpert.bio || 'No profile bio available yet.'}</p>
                
                {selectedExpert.skills && selectedExpert.skills.length > 0 && (
                  <>
                    <div style={styles.modalSectionTitle}>Skills</div>
                    <div>
                      {selectedExpert.skills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>
                          {typeof skill === 'string' ? skill : skill.name || skill} {skill.level ? `(${skill.level})` : ''}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {selectedExpert.hourlyRate > 0 && (
                  <>
                    <div style={styles.modalSectionTitle}>Hourly Rate</div>
                    <p>${selectedExpert.hourlyRate}/hour</p>
                  </>
                )}

                {/* --- REVIEWS DISPLAY SECTION --- */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                  <div style={styles.modalSectionTitle}>Client Reviews</div>
                  
                  {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-gray)' }}>No reviews yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      {reviews.map((rev) => (
                        <div key={rev._id} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                          <div style={{ fontWeight: 'bold' }}>
                            {rev.client?.name || 'Client'} 
                            <span style={{ color: '#fbbf24', marginLeft: '8px' }}>
                              {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                            </span>
                          </div>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ONLY show the form if the logged-in user is a Client! */}
                  {(user?.role === 'client' || user?.role === 'Client') && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <ReviewForm 
                        expertId={selectedExpert._id} 
                        onReviewAdded={() => {
                          fetchExperts(currentPage); 
                          axios.get(`http://localhost:5000/api/reviews/${selectedExpert._id}`)
                            .then(res => setReviews(res.data.reviews));
                        }} 
                      />
                    </div>
                  )}
                </div>
                {/* 👆 END OF REVIEWS SECTION 👆 */}

              </div> {/* <-- This safely closes the modalBody */}

              <div style={styles.modalActions}>
                <button 
                  style={styles.messageButton} 
                  onClick={() => openChat(selectedExpert)}
                >
                  ✉️ Message
                </button>
                <button style={styles.closeButton} onClick={() => setSelectedExpert(null)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experts;