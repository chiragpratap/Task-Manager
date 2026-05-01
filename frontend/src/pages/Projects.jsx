import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user.token]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setShowForm(false);
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#F9FAFB' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="3" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Project</button>
          </form>
        </div>
      )}

      <div className="grid">
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No projects found.</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="card">
              <h3>{project.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1rem' }}>{project.description || 'No description provided.'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ backgroundColor: '#E5E7EB', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                  {project.members?.length || 0} Members
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
