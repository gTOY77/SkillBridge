import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    openDisputes: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Grab the token from local storage (adjust if you store it differently!)
      const token = localStorage.getItem('token'); 
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch Stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers });
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsRes.json();
      setSystemStats(statsData);

      // Fetch Users
      const usersRes = await fetch('http://localhost:5000/api/admin/users', { headers });
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const usersData = await usersRes.json();
      setRecentUsers(usersData);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Backend rejected your token or server is down. Try logging out and back in.');
      setLoading(false);
    }
  };

  const handleAction = async (action, userId) => {
    const status = action === 'Approve' ? 'Active' : 'Banned';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        alert(`User successfully ${status.toLowerCase()}!`);
        fetchAdminData(); // Refresh the list
      } else {
        alert('Failed to update user.');
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) return <div>Loading Admin Data...</div>;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👑 Admin Control Panel</h1>

      {/* Analytics & Reporting Section */}
      <h2 style={styles.sectionTitle}>📊 Platform Analytics</h2>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{systemStats.totalUsers}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{systemStats.activeProjects}</div>
          <div style={styles.statLabel}>Active Projects</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${systemStats.totalRevenue}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #ef4444' }}>
          <div style={{ ...styles.statValue, color: '#ef4444' }}>{systemStats.openDisputes}</div>
          <div style={styles.statLabel}>Open Disputes</div>
        </div>
      </div>

      {/* Control Panel / Monitoring Section */}
      <h2 style={styles.sectionTitle}>🛠️ System Monitoring & User Management</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(user => (
              <tr key={user._id} style={styles.tr}>
                <td style={styles.td}><strong>{user.name}</strong></td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(user.status)}>{user.status || 'Active'}</span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleAction('Approve', user._id)} style={styles.actionBtn}>✅</button>
                  <button onClick={() => handleAction('Ban', user._id)} style={styles.actionBtn}>🚫</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STYLES ---
const getStatusStyle = (status) => {
  const baseStyle = { padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' };
  if (status === 'Active' || !status) return { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' };
  if (status === 'Pending') return { ...baseStyle, backgroundColor: '#fef9c3', color: '#854d0e' };
  if (status === 'Banned') return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
  return baseStyle;
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f9fafb', minHeight: '100vh' },
  title: { fontSize: '2rem', color: '#111827', marginBottom: '2rem' },
  sectionTitle: { fontSize: '1.3rem', color: '#374151', marginTop: '2rem', marginBottom: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
  statValue: { fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' },
  statLabel: { color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { backgroundColor: '#f3f4f6', padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' },
  td: { padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#4b5563' },
  tr: { transition: 'background-color 0.2s' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', margin: '0 5px' }
};

export default AdminDashboard;