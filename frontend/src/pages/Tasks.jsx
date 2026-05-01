import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for Admin
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch('/api/tasks', { headers: { Authorization: `Bearer ${user.token}` } }),
        fetch('/api/projects', { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, description, project: projectId })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setProjectId('');
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#F9FAFB' }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="2" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Project</label>
              <select className="form-select" value={projectId} onChange={e => setProjectId(e.target.value)} required>
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={!projectId}>Create Task</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F3F4F6', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Task</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Project</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Status</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found.</td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{task.description}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{task.project?.title || 'Unknown'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status-badge status-${task.status.replace(' ', '').toLowerCase()}`}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-select" 
                      style={{ padding: '0.25rem', width: 'auto' }}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
