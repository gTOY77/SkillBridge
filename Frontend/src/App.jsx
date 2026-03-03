import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';       // 👈 New import
import Register from './pages/Register'; // 👈 New import

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <div style={{ padding: '0rem 0rem 2rem 0rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experts" element={<h2 style={{padding: '2rem'}}>Student Expert Search Page</h2>} />
          {/* 👇 Replaced placeholders with your new components */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;