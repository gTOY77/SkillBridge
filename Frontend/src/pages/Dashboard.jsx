import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ClientDashboard from './ClientDashboard';
import ExpertDashboard from './ExpertDashboard';

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

  return user.role === 'expert' ? <ExpertDashboard /> : <ClientDashboard />;
};

export default Dashboard;
