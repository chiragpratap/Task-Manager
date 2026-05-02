import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, ListTodo, AlertTriangle, TrendingUp } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  const todoCount = tasks.filter(t => t.status === 'Todo').length;
  const progressCount = tasks.filter(t => t.status === 'In Progress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const overdueCount = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div className="animate-fade-in-up" id="dashboard-page">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.375rem' }}>
          Welcome back, {user.name}
          <span style={{ display: 'inline-block', marginLeft: '0.5rem', animation: 'fadeIn 1s ease' }}>👋</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Here's what's happening across your {user.role === 'Admin' ? 'projects' : 'assigned tasks'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-stats" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-icon stat-icon-blue">
            <ListTodo size={22} />
          </div>
          <div>
            <div className="stat-label">To Do</div>
            <div className="stat-value">{todoCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon stat-icon-amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{progressCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon stat-icon-green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{doneCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon stat-icon-red">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{overdueCount}</div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      {totalTasks > 0 && (
        <div className="card-static" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Overall Progress</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--primary-hover)', fontSize: '0.875rem' }}>
              {completionRate}%
            </span>
          </div>
          <div style={{
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(148, 163, 184, 0.12)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${completionRate}%`,
              background: 'linear-gradient(90deg, #6366F1, #A78BFA)',
              borderRadius: '3px',
              transition: 'width 1s ease-out',
            }} />
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card-static">
        <h2 style={{ marginBottom: '1rem' }}>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No tasks found. {user.role === 'Admin' ? 'Create a project and add some tasks!' : 'Tasks assigned to you will appear here.'}</p>
          </div>
        ) : (
          <div>
            {tasks.slice(0, 6).map((task, index) => (
              <div
                key={task._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 0',
                  borderBottom: index < Math.min(tasks.length, 6) - 1 ? '1px solid var(--border-color)' : 'none',
                  animation: `fadeInUp ${0.3 + index * 0.05}s ease-out`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <small style={{ color: 'var(--text-muted)' }}>
                      {task.project?.title || 'Unknown project'}
                    </small>
                    {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' && (
                      <span className="overdue-text">⚠ Overdue</span>
                    )}
                  </div>
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
