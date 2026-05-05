import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return setMessage({ text: 'Please describe the issue.', type: 'error' });

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/reports', 
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage({ text: 'Report sent to Admin successfully!', type: 'success' });
        setDescription('');
      }
    } catch (err) {
      setMessage({ text: 'Failed to submit report', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#b91c1c', marginBottom: '1rem' }}>Report an Issue</h3>
      {message.text && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#b91c1c' : '#166534' }}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '1rem' }}
          placeholder="Describe the problem in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Sending...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;