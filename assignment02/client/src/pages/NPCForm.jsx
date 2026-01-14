import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { npcAPI } from '../services/api';

const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn', 'Other'];
const classes = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk', 'Sorcerer', 'Warlock', 'Commoner', 'Noble', 'Merchant', 'Other'];
const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

function NPCForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    race: 'Human',
    class: 'Fighter',
    alignment: 'True Neutral',
    level: 1,
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchNPC();
    }
  }, [id]);

  const fetchNPC = async () => {
    try {
      const response = await npcAPI.getById(id);
      setFormData(response.data.npc);
    } catch (err) {
      setErrors({ submit: 'Failed to load NPC' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.level < 1 || formData.level > 20) newErrors.level = 'Level must be between 1 and 20';
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
        await npcAPI.update(id, formData);
      } else {
        await npcAPI.create(formData);
      }
      navigate('/npcs');
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Failed to save NPC' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div className="card">
        <h1 className="card-title">{isEdit ? 'Edit NPC' : 'Create New NPC'}</h1>
        {errors.submit && <div className="error">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="race">Race *</label>
            <select id="race" name="race" className="form-control" value={formData.race} onChange={handleChange}>
              {races.map(race => <option key={race} value={race}>{race}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="class">Class *</label>
            <select id="class" name="class" className="form-control" value={formData.class} onChange={handleChange}>
              {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="alignment">Alignment *</label>
            <select id="alignment" name="alignment" className="form-control" value={formData.alignment} onChange={handleChange}>
              {alignments.map(align => <option key={align} value={align}>{align}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Level *</label>
            <input
              type="number"
              id="level"
              name="level"
              className="form-control"
              value={formData.level}
              onChange={handleChange}
              min="1"
              max="20"
            />
            {errors.level && <div className="form-error">{errors.level}</div>}
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
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="6"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update NPC' : 'Create NPC')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/npcs')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NPCForm;