import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    boxShadow: 'var(--shadow)',
    borderBottom: '2px solid var(--border-light)',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary-blue)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    listStyle: 'none',
  };

  const linkStyle = {
    color: 'var(--text-dark)',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  };

  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    backgroundColor: 'var(--success-green)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--danger-red)',
  };

  const userMenuStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  };

  const userInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  };

  const userNameStyle = {
    fontWeight: '600',
    color: 'var(--text-dark)',
  };

  const userRoleStyle = {
    fontSize: '0.85rem',
    color: 'var(--text-gray)',
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>
        <span style={{ fontSize: '1.8rem' }}>🚀</span>
        SkillBridge
      </Link>

      <ul style={navLinksStyle}>
        <li>
          <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/experts" style={linkStyle} onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}>
            Find Experts
          </Link>
        </li>
        <li>
          <Link to="/projects" style={linkStyle} onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}>
            Browse Projects
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link to="/login" style={linkStyle} onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" style={buttonStyle}>
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              {/* 👇 Changed this to say Admin Panel if you are an admin */}
              <Link to="/dashboard" style={linkStyle} onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}>
                {user.role === 'admin' ? '👑 Admin Panel' : '📊 Dashboard'}
              </Link>
            </li>
            <li style={userMenuStyle}>
              <div style={userInfoStyle}>
                <div style={userNameStyle}>{user.name}</div>
                
                {/* 👇 Added the Admin role check here! */}
                <div style={userRoleStyle}>
                  {user.role === 'admin' ? '👑 Admin' : user.role === 'expert' ? '💼 Expert' : '📚 Client'}
                </div>

              </div>
              <button onClick={handleLogout} style={logoutButtonStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--danger-red)'}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;