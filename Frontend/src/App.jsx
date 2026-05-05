import React from 'react';
import ReportForm from './components/ReportForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Experts from './pages/Experts';
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import BrowseProjects from './pages/BrowseProjects';
import CreateProject from './pages/CreateProject';
import AdminReports from './pages/AdminReports';
import ProjectDetails from './pages/ProjectDetails';
import PostProject from './pages/PostProject';
import EditProject from './pages/EditProject';
import ChatPopup from './components/ChatPopup';
import MessageNotificationBar from './components/MessageNotificationBar';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/projects" element={<BrowseProjects />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/create-project" element={<PostProject />} />
        <Route path="/edit-project/:id" element={<EditProject />} />
        <Route path="*" element={<h2 style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</h2>} />
      </Routes>
      {user && (
        <>
          <ChatPopup />
          <MessageNotificationBar />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;