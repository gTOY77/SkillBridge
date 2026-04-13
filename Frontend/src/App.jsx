import React from 'react';
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

function App() {
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
        <Route path="*" element={<h2 style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;