import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { npcAPI, questAPI } from '../services/api';

function Profile() {
  const { user } = useAuth();
  const [myNPCs, setMyNPCs] = useState([]);
  const [myQuests, setMyQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyContent();
  }, []);

  const fetchMyContent = async () => {
    try {
      const [npcsRes, questsRes] = await Promise.all([
        npcAPI.getAll({ limit: 10 }),
        questAPI.getAll({ limit: 10 })
      ]);
      
      // Filter to only show user's content
      setMyNPCs(npcsRes.data.npcs.filter(npc => npc.createdBy._id === user.id));
      setMyQuests(questsRes.data.quests.filter(quest => quest.createdBy._id === user.id));
    } catch (err) {
      console.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div>
      <div className="card">
        <h1 className="card-title">My Profile</h1>
        <div className="detail-info">
          <div className="info-item">
            <div className="info-label">Username</div>
            <div className="info-value">{user.username}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Email</div>
            <div className="info-value">{user.email}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Role</div>
            <div className="info-value">{user.role}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>My NPCs ({myNPCs.length})</h2>
          <Link to="/npcs/create" className="btn btn-primary">Create NPC</Link>
        </div>
        {myNPCs.length === 0 ? (
          <p>You haven't created any NPCs yet.</p>
        ) : (
          <div className="grid">
            {myNPCs.map(npc => (
              <div key={npc._id} className="card">
                <h3>{npc.name}</h3>
                <p>{npc.race} {npc.class}</p>
                <Link to={`/npcs/${npc._id}`} className="btn btn-secondary">View</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>My Quests ({myQuests.length})</h2>
          <Link to="/quests/create" className="btn btn-primary">Create Quest</Link>
        </div>
        {myQuests.length === 0 ? (
          <p>You haven't created any quests yet.</p>
        ) : (
          <div className="grid">
            {myQuests.map(quest => (
              <div key={quest._id} className="card">
                <h3>{quest.title}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <span className={`badge badge-${quest.difficulty.toLowerCase()}`}>{quest.difficulty}</span>
                  {' '}
                  <span className={`badge badge-${quest.status.toLowerCase().replace(' ', '-')}`}>{quest.status}</span>
                </div>
                <Link to={`/quests/${quest._id}`} className="btn btn-secondary">View</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;