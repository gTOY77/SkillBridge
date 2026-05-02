import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ClientDashboard from './ClientDashboard';
import ExpertDashboard from './ExpertDashboard';
import AdminDashboard from './AdminDashboard'; 

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.1rem',
        color: 'var(--text-gray)',
      }}>
        🔄 Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 👇 2. We added this check for the admin role!
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // 3. Everyone else gets handled normally
  return user.role === 'expert' ? <ExpertDashboard /> : <ClientDashboard />;
};

export default Dashboard;