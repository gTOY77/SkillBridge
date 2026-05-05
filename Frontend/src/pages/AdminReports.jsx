import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports on load
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data.reports);
      } catch (err) {
        console.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // NEW: Function to handle marking a report as solved
  const handleSolve = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      // Call the backend to update the status
      await axios.put(`http://localhost:5000/api/reports/${reportId}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Instantly update the UI without refreshing the page
      setReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId 
            ? { ...report, status: 'Resolved' } 
            : report
        )
      );
    } catch (error) {
      console.error("Failed to resolve report:", error);
      alert("Could not update the report status.");
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Reports Dashboard</h1>
      {reports.length === 0 ? <p>No reports found.</p> : (
        reports.map(report => (
          <div key={report._id} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #ef4444', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              <strong>{report.reportedBy?.name || 'Unknown'}</strong> ({report.reportedBy?.role || 'user'}) - {new Date(report.createdAt).toLocaleDateString()}
            </div>
            
            <p>{report.description}</p>
            
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: report.status === 'Resolved' ? '#d1fae5' : '#fee2e2', 
                color: report.status === 'Resolved' ? '#047857' : '#b91c1c', 
                borderRadius: '4px', 
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                Status: {report.status}
              </span>

              {/* NEW: Conditional Button */}
              {report.status === 'Pending' && (
                <button 
                  onClick={() => handleSolve(report._id)}
                  style={{ 
                    backgroundColor: '#10b981', 
                    color: '#fff', 
                    padding: '5px 10px', 
                    borderRadius: '4px', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold' 
                  }}
                >
                  ✓ Mark as Solved
                </button>
              )}
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default AdminReports;