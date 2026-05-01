import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user.token]);

  if (loading) return <div>Loading dashboard...</div>;

  const todoCount = tasks.filter(t => t.status === 'Todo').length;
  const progressCount = tasks.filter(t => t.status === 'In Progress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user.name}!</h1>
      
      <div className="grid">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '50%' }}>
            <ListTodo size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>To Do</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{todoCount}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#FFFBEB', color: '#F59E0B', borderRadius: '50%' }}>
            <Clock size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>In Progress</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{progressCount}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '50%' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Completed</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{doneCount}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No tasks found.</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  <small style={{ color: 'var(--text-muted)' }}>Project: {task.project?.title}</small>
                </div>
                <span className={`status-badge status-${task.status.replace(' ', '').toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
