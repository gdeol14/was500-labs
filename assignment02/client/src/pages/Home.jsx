import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>Dungeon Master Toolkit</h1>
        <p>Manage your campaigns, NPCs, and quests all in one place</p>
        {!isAuthenticated && (
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        )}
      </div>

      <div className="grid">
        <div className="card">
          <h2 className="card-title">📜 Manage NPCs</h2>
          <p>Create and organize your non-player characters with detailed profiles including race, class, alignment, and notes.</p>
          <Link to="/npcs" className="btn btn-primary" style={{ marginTop: '15px' }}>Browse NPCs</Link>
        </div>

        <div className="card">
          <h2 className="card-title">⚔️ Track Quests</h2>
          <p>Keep track of your campaign quests with difficulty ratings, status updates, rewards, and associated NPCs.</p>
          <Link to="/quests" className="btn btn-primary" style={{ marginTop: '15px' }}>View Quests</Link>
        </div>

        <div className="card">
          <h2 className="card-title">🎲 Campaign Tools</h2>
          <p>Link NPCs to quests, organize by location, and manage your entire D&D campaign efficiently.</p>
          {isAuthenticated ? (
            <Link to="/profile" className="btn btn-primary" style={{ marginTop: '15px' }}>My Profile</Link>
          ) : (
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '15px' }}>Sign Up</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;