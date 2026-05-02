 import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Search
  const [search, setSearch] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/projects', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    if (user.role !== 'Admin') return;

    try {
      const res = await fetch('/api/auth/users', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // Search Filter
  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProjects(filtered);
  }, [search, projects]);

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!title.trim()) {
      return setError('Project title is required');
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title,
          description,
          members: selectedMembers
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage('Project created successfully');

      setTitle('');
      setDescription('');
      setSelectedMembers([]);
      setShowForm(false);

      fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    }
  };

  // Delete Project
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      setProjects(projects.filter(project => project._id !== id));
      setMessage('Project deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMemberSelection = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      option => option.value
    );

    setSelectedMembers(values);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading Projects...</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        className="flex-between"
        style={{ marginBottom: '2rem' }}
      >
        <h1>Projects Dashboard</h1>

        {user.role === 'Admin' && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search projects..."
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Create Form */}
      {showForm && (
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            background: '#F9FAFB'
          }}
        >
          <h3>Create New Project</h3>

          <form
            onSubmit={handleCreateProject}
            style={{ marginTop: '1rem' }}
          >
            <div className="form-group">
              <label className="form-label">
                Project Title
              </label>

              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Description
              </label>

              <textarea
                rows="4"
                className="form-input"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Assign Members
              </label>

              <select
                multiple
                className="form-select"
                value={selectedMembers}
                onChange={handleMemberSelection}
                style={{ height: '120px' }}
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Project Cards */}
      <div className="grid">
        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="card"
              style={{
                transition: '0.3s',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <h3>{project.title}</h3>

                <span
                  style={{
                    background: '#DCFCE7',
                    color: '#166534',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}
                >
                  Active
                </span>
              </div>

              <p
                style={{
                  marginTop: '10px',
                  color: '#6B7280'
                }}
              >
                {project.description ||
                  'No description available'}
              </p>

              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  👥 {project.members?.length || 0} Members
                </span>

                <small>
                  {new Date(
                    project.createdAt
                  ).toLocaleDateString()}
                </small>
              </div>

              {user.role === 'Admin' && (
                <button
                  onClick={() =>
                    handleDelete(project._id)
                  }
                  className="btn btn-danger"
                  style={{
                    marginTop: '1rem',
                    width: '100%'
                  }}
                >
                  Delete Project
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;