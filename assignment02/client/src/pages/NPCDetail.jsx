import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { npcAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function NPCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [npc, setNpc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNPC();
  }, [id]);

  const fetchNPC = async () => {
    try {
      const response = await npcAPI.getById(id);
      setNpc(response.data.npc);
    } catch (err) {
      setError('Failed to load NPC');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this NPC?')) return;
    
    try {
      await npcAPI.delete(id);
      navigate('/npcs');
    } catch (err) {
      setError('Failed to delete NPC');
    }
  };

  if (loading) return <div className="loading">Loading NPC...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!npc) return <div className="error">NPC not found</div>;

  const canEdit = user && npc.createdBy._id === user.id;

  return (
    <div>
      <div className="card">
        <div className="detail-header">
          <div>
            <h1 className="card-title">{npc.name}</h1>
            <p style={{ color: '#666' }}>Created by {npc.createdBy.username}</p>
          </div>
          {canEdit && (
            <div className="detail-actions">
              <Link to={`/npcs/edit/${npc._id}`} className="btn btn-primary">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="info-item">
            <div className="info-label">Race</div>
            <div className="info-value">{npc.race}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Class</div>
            <div className="info-value">{npc.class}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Alignment</div>
            <div className="info-value">{npc.alignment}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Level</div>
            <div className="info-value">{npc.level}</div>
          </div>
          {npc.location && (
            <div className="info-item">
              <div className="info-label">Location</div>
              <div className="info-value">{npc.location}</div>
            </div>
          )}
        </div>

        {npc.notes && (
          <div style={{ marginTop: '20px' }}>
            <h3>Notes</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{npc.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <Link to="/npcs" className="btn btn-secondary">Back to NPCs</Link>
        </div>
      </div>
    </div>
  );
}

export default NPCDetail;