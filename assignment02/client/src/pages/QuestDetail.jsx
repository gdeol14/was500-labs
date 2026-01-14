import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { questAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function QuestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuest();
  }, [id]);

  const fetchQuest = async () => {
    try {
      const response = await questAPI.getById(id);
      setQuest(response.data.quest);
    } catch (err) {
      setError('Failed to load quest');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this quest?')) return;
    
    try {
      await questAPI.delete(id);
      navigate('/quests');
    } catch (err) {
      setError('Failed to delete quest');
    }
  };

  if (loading) return <div className="loading">Loading Quest...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quest) return <div className="error">Quest not found</div>;

  const canEdit = user && quest.createdBy._id === user.id;

  return (
    <div>
      <div className="card">
        <div className="detail-header">
          <div>
            <h1 className="card-title">{quest.title}</h1>
            <p style={{ color: '#666' }}>Created by {quest.createdBy.username}</p>
            <div style={{ marginTop: '10px' }}>
              <span className={`badge badge-${quest.difficulty.toLowerCase()}`}>{quest.difficulty}</span>
              {' '}
              <span className={`badge badge-${quest.status.toLowerCase().replace(' ', '-')}`}>{quest.status}</span>
            </div>
          </div>
          {canEdit && (
            <div className="detail-actions">
              <Link to={`/quests/edit/${quest._id}`} className="btn btn-primary">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{quest.description}</p>
        </div>

        <div className="detail-info" style={{ marginTop: '20px' }}>
          {quest.location && (
            <div className="info-item">
              <div className="info-label">Location</div>
              <div className="info-value">{quest.location}</div>
            </div>
          )}
          {quest.reward && (
            <div className="info-item">
              <div className="info-label">Reward</div>
              <div className="info-value">{quest.reward}</div>
            </div>
          )}
        </div>

        {quest.npcs && quest.npcs.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Associated NPCs</h3>
            <div className="grid">
              {quest.npcs.map((npc) => (
                <div key={npc._id} className="card">
                  <h4>{npc.name}</h4>
                  <p>{npc.race} {npc.class}</p>
                  <Link to={`/npcs/${npc._id}`} className="btn btn-secondary">View NPC</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {quest.notes && (
          <div style={{ marginTop: '20px' }}>
            <h3>Notes</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{quest.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <Link to="/quests" className="btn btn-secondary">Back to Quests</Link>
        </div>
      </div>
    </div>
  );
}

export default QuestDetail;