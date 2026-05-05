import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ expertId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validate the inputs
    if (rating === 0) {
      setError('Please select a star rating!');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a short review comment.');
      return;
    }

    setLoading(true);
    try {
      // 2. Grab the logged-in user's token
      const token = localStorage.getItem('token');
      
      // 3. Send the review to the new backend route
      const res = await axios.post(
        'http://localhost:5000/api/reviews',
        { expertId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } } // Must send token to prove who is writing it!
      );

      if (res.data.success) {
        setSuccess('Thank you! Your review has been posted.');
        setRating(0);
        setComment('');
        
        // If the parent page passed a refresh function, call it so the new review shows up instantly!
        if (onReviewAdded) {
          onReviewAdded();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    card: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
      marginTop: '2rem',
      maxWidth: '600px',
    },
    title: {
      fontSize: '1.4rem',
      color: '#1e3a8a', // Dark blue
      marginBottom: '1rem',
      fontWeight: '700',
    },
    starsContainer: {
      display: 'flex',
      gap: '0.25rem',
      marginBottom: '1.2rem',
    },
    star: (isFilled) => ({
      fontSize: '2.2rem',
      cursor: 'pointer',
      color: isFilled ? '#fbbf24' : '#d1d5db', // Gold if filled, gray if empty
      transition: 'color 0.2s ease-in-out',
      lineHeight: '1',
    }),
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      marginBottom: '1rem',
      boxSizing: 'border-box',
    },
    button: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#2563eb', // Primary blue
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    messageBox: (isError) => ({
      padding: '0.75rem 1rem',
      backgroundColor: isError ? '#fee2e2' : '#dcfce7',
      color: isError ? '#b91c1c' : '#166534',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
    })
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Leave a Review</h3>
      
      {error && <div style={styles.messageBox(true)}>{error}</div>}
      {success && <div style={styles.messageBox(false)}>{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Interactive 5-Star Rating */}
        <div style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={styles.star(star <= (hover || rating))}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment Box */}
        <textarea
          style={styles.textarea}
          placeholder="What was it like working with this expert? Describe your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          disabled={loading}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;