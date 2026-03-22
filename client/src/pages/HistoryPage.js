import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css';

const ALGO_COLORS = {
  linear_regression: '#00e5ff',
  kmeans: '#a855f7',
  logistic_regression: '#22c55e',
};

const ALGO_LABELS = {
  linear_regression: 'Linear Regression',
  kmeans: 'K-Means Clustering',
  logistic_regression: 'Logistic Regression',
};

export default function HistoryPage() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/experiments')
      .then(res => setExperiments(res.data))
      .catch(() => setError('Could not load history. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/experiments/${id}`);
      setExperiments(prev => prev.filter(e => e._id !== id));
    } catch { alert('Delete failed'); }
  };

  return (
    <div className="page history-page">
      <div className="history-header fade-up">
        <div className="history-title-wrap">
          <div className="history-tag">// experiment log</div>
          <h1 className="history-title">Saved <span className="history-accent">Experiments</span></h1>
          <p className="history-sub">All your past ML runs stored in MongoDB</p>
        </div>
        <div className="history-count card">
          <p className="count-num">{experiments.length}</p>
          <p className="count-label">experiments</p>
        </div>
      </div>

      {loading && (
        <div className="history-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card card" />
          ))}
        </div>
      )}

      {error && (
        <div className="card history-error">⚠ {error}</div>
      )}

      {!loading && !error && experiments.length === 0 && (
        <div className="card empty-history fade-up-1">
          <div className="empty-icon">{'[ ]'}</div>
          <p className="empty-title">No experiments yet</p>
          <p className="empty-sub">Run an algorithm and click "Save Experiment" to see it here.</p>
        </div>
      )}

      {!loading && experiments.length > 0 && (
        <div className="history-list fade-up-1">
          {experiments.map((exp, i) => (
            <div
              key={exp._id}
              className="exp-card card"
              style={{ animationDelay: `${i * 0.05}s`, '--algo-color': ALGO_COLORS[exp.algorithm] || '#00e5ff' }}
            >
              <div className="exp-left">
                <div className="exp-algo-dot" />
                <div>
                  <p className="exp-name">{exp.name}</p>
                  <div className="exp-meta">
                    <span className="exp-algo-badge" style={{ color: ALGO_COLORS[exp.algorithm] }}>
                      {ALGO_LABELS[exp.algorithm] || exp.algorithm}
                    </span>
                    <span className="exp-date">
                      {new Date(exp.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {exp.insights && (
                    <p className="exp-insight">{exp.insights.slice(0, 100)}...</p>
                  )}
                </div>
              </div>
              <div className="exp-right">
                <div className="exp-params">
                  {exp.parameters && Object.entries(exp.parameters).map(([k, v]) => (
                    <span key={k} className="exp-param">
                      {k}={v}
                    </span>
                  ))}
                </div>
                <button className="btn btn-danger exp-del" onClick={(e) => handleDelete(exp._id, e)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
