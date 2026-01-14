import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { npcAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function NPCList() {
  const { isAuthenticated } = useAuth();
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ race: '', class: '', search: '', page: 1 });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchNPCs();
  }, [filters]);

  const fetchNPCs = async () => {
    try {
      setLoading(true);
      const response = await npcAPI.getAll(filters);
      setNpcs(response.data.npcs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load NPCs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  if (loading) return <div className="loading">Loading NPCs...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>NPCs</h1>
        {isAuthenticated && (
          <Link to="/npcs/create" className="btn btn-primary">Create NPC</Link>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <div className="form-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            name="search"
            className="form-control"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name or location..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="race">Race</label>
          <select id="race" name="race" className="form-control" value={filters.race} onChange={handleFilterChange}>
            <option value="">All Races</option>
            <option value="Human">Human</option>
            <option value="Elf">Elf</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Halfling">Halfling</option>
            <option value="Gnome">Gnome</option>
            <option value="Half-Elf">Half-Elf</option>
            <option value="Half-Orc">Half-Orc</option>
            <option value="Tiefling">Tiefling</option>
            <option value="Dragonborn">Dragonborn</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="class">Class</label>
          <select id="class" name="class" className="form-control" value={filters.class} onChange={handleFilterChange}>
            <option value="">All Classes</option>
            <option value="Fighter">Fighter</option>
            <option value="Wizard">Wizard</option>
            <option value="Rogue">Rogue</option>
            <option value="Cleric">Cleric</option>
            <option value="Ranger">Ranger</option>
            <option value="Paladin">Paladin</option>
            <option value="Barbarian">Barbarian</option>
            <option value="Bard">Bard</option>
            <option value="Commoner">Commoner</option>
            <option value="Noble">Noble</option>
          </select>
        </div>
      </div>

      {npcs.length === 0 ? (
        <div className="card">
          <p>No NPCs found. {isAuthenticated && 'Create your first NPC to get started!'}</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {npcs.map((npc) => (
              <div key={npc._id} className="card">
                <h3 className="card-title">{npc.name}</h3>
                <p><strong>Race:</strong> {npc.race}</p>
                <p><strong>Class:</strong> {npc.class}</p>
                <p><strong>Alignment:</strong> {npc.alignment}</p>
                <p><strong>Level:</strong> {npc.level}</p>
                {npc.location && <p><strong>Location:</strong> {npc.location}</p>}
                <Link to={`/npcs/${npc._id}`} className="btn btn-primary" style={{ marginTop: '10px' }}>
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button
                disabled={filters.page === pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NPCList;