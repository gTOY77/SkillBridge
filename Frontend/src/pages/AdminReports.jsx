import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <span style={{ display: 'inline-block', marginTop: '1rem', padding: '4px 8px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.8rem' }}>
              Status: {report.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReports;