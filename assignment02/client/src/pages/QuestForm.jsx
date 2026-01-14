import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questAPI, npcAPI } from '../services/api';

const difficulties = ['Easy', 'Medium', 'Hard', 'Deadly'];
const statuses = ['Not Started', 'In Progress', 'Completed', 'Failed'];

function QuestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    status: 'Not Started',
    reward: '',
    location: '',
    notes: '',
    npcs: []
  });
  const [availableNPCs, setAvailableNPCs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNPCs();
    if (isEdit) {
      fetchQuest();
    }
  }, [id]);

  const fetchNPCs = async () => {
    try {
      const response = await npcAPI.getAll({ limit: 100 });
      setAvailableNPCs(response.data.npcs);
    } catch (err) {
      console.error('Failed to load NPCs');
    }
  };

  const fetchQuest = async () => {
    try {
      const response = await questAPI.getById(id);
      const quest = response.data.quest;
      setFormData({
        ...quest,
        npcs: quest.npcs.map(npc => npc._id)
      });
    } catch (err) {
      setErrors({ submit: 'Failed to load quest' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleNPCToggle = (npcId) => {
    const npcs = formData.npcs.includes(npcId)
      ? formData.npcs.filter(id => id !== npcId)
      : [...formData.npcs, npcId];
    setFormData({ ...formData, npcs });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await questAPI.update(id, formData);
      } else {
        await questAPI.create(formData);
      }
      navigate('/quests');
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Failed to save quest' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div className="card">
        <h1 className="card-title">{isEdit ? 'Edit Quest' : 'Create New Quest'}</h1>
        {errors.submit && <div className="error">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="6"
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty *</label>
            <select id="difficulty" name="difficulty" className="form-control" value={formData.difficulty} onChange={handleChange}>
              {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange}>
              {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reward">Reward</label>
            <input
              type="text"
              id="reward"
              name="reward"
              className="form-control"
              value={formData.reward}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Associated NPCs</label>
            <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--border)', borderRadius: '4px', padding: '10px' }}>
              {availableNPCs.length === 0 ? (
                <p>No NPCs available</p>
              ) : (
                availableNPCs.map(npc => (
                  <div key={npc._id} style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.npcs.includes(npc._id)}
                        onChange={() => handleNPCToggle(npc._id)}
                        style={{ marginRight: '8px' }}
                      />
                      {npc.name} ({npc.race} {npc.class})
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Quest' : 'Create Quest')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/quests')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestForm;