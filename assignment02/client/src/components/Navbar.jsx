import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🎲 DM Toolkit
        </Link>
        <ul className="navbar-links">
          <li><Link to="/npcs">NPCs</Link></li>
          <li><Link to="/quests">Quests</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;