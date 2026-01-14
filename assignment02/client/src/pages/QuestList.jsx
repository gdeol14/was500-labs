import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function QuestList() {
  const { isAuthenticated } = useAuth();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ difficulty: '', status: '', search: '', page: 1 });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchQuests();
  }, [filters]);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const response = await questAPI.getAll(filters);
      setQuests(response.data.quests);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  if (loading) return <div className="loading">Loading Quests...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quests</h1>
        {isAuthenticated && (
          <Link to="/quests/create" className="btn btn-primary">Create Quest</Link>
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
            placeholder="Search by title or location..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" className="form-control" value={filters.difficulty} onChange={handleFilterChange}>
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Deadly">Deadly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" className="form-control" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {quests.length === 0 ? (
        <div className="card">
          <p>No quests found. {isAuthenticated && 'Create your first quest to get started!'}</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {quests.map((quest) => (
              <div key={quest._id} className="card">
                <h3 className="card-title">{quest.title}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <span className={`badge badge-${quest.difficulty.toLowerCase()}`}>{quest.difficulty}</span>
                  {' '}
                  <span className={`badge badge-${quest.status.toLowerCase().replace(' ', '-')}`}>{quest.status}</span>
                </div>
                <p>{quest.description.substring(0, 150)}{quest.description.length > 150 ? '...' : ''}</p>
                {quest.location && <p><strong>Location:</strong> {quest.location}</p>}
                {quest.reward && <p><strong>Reward:</strong> {quest.reward}</p>}
                <Link to={`/quests/${quest._id}`} className="btn btn-primary" style={{ marginTop: '10px' }}>
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

export default QuestList;