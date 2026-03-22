import React, { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import './PlaygroundPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ALGORITHMS = [
  { id: 'linear_regression', label: 'Linear Regression', desc: 'Fit a line through data points', color: '#00e5ff' },
  { id: 'kmeans', label: 'K-Means Clustering', desc: 'Group data into k clusters', color: '#a855f7' },
  { id: 'logistic_regression', label: 'Logistic Regression', desc: 'Binary classification model', color: '#22c55e' },
];

const CLUSTER_COLORS = ['#00e5ff', '#a855f7', '#f97316', '#f43f5e', '#22c55e'];

export default function PlaygroundPage() {
  const [selected, setSelected] = useState('linear_regression');
  const [params, setParams] = useState({ n: 50, k: 3 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const run = async () => {
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const res = await axios.post('/api/ml/run', { algorithm: selected, parameters: params });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run algorithm');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!result) return;
    try {
      await axios.post('/api/experiments', {
        name: `${selected} — ${new Date().toLocaleString()}`,
        algorithm: selected, parameters: params,
        results: result.results, insights: result.insights,
      });
      setSaved(true);
    } catch { setError('Failed to save'); }
  };

  // Build chart data safely
  const buildChartData = () => {
    if (!result || !result.results) return null;
    const { algorithm, results } = result;

    if (algorithm === 'linear_regression') {
      const original = results.original || [];
      const predicted = results.predicted || [];
      if (!original.length) return null;
      return {
        datasets: [
          {
            label: 'Data Points',
            data: original.map(p => ({ x: p.x, y: p.y })),
            backgroundColor: 'rgba(0,229,255,0.5)',
            pointRadius: 5,
            showLine: false,
          },
          {
            label: 'Regression Line',
            data: predicted.sort((a,b) => a.x - b.x).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: 'transparent',
            borderColor: '#f97316',
            showLine: true,
            pointRadius: 0,
            borderWidth: 2,
          }
        ]
      };
    }

    if (algorithm === 'kmeans') {
      const points = results.points || [];
      const centroids = results.centroids || [];
      const k = results.k || 3;
      if (!points.length) return null;
      return {
        datasets: [
          ...Array.from({ length: k }, (_, i) => ({
            label: `Cluster ${i + 1}`,
            data: points.filter(p => p.cluster === i).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: CLUSTER_COLORS[i] + '99',
            pointRadius: 6,
            showLine: false,
          })),
          {
            label: 'Centroids',
            data: centroids.map(c => ({ x: c.x, y: c.y })),
            backgroundColor: '#ffffff',
            pointRadius: 10,
            showLine: false,
          }
        ]
      };
    }

    if (algorithm === 'logistic_regression') {
      const predictions = results.predictions || [];
      if (!predictions.length) return null;
      return {
        datasets: [
          {
            label: 'Class 0',
            data: predictions.filter(p => p.label === 0).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: 'rgba(0,229,255,0.6)',
            pointRadius: 6,
            showLine: false,
          },
          {
            label: 'Class 1',
            data: predictions.filter(p => p.label === 1).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: 'rgba(168,85,247,0.6)',
            pointRadius: 6,
            showLine: false,
          },
          {
            label: 'Misclassified',
            data: predictions.filter(p => p.label !== p.predicted).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: 'rgba(244,63,94,0.9)',
            pointRadius: 9,
            showLine: false,
          }
        ]
      };
    }

    return null;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#7878aa', font: { family: 'Plus Jakarta Sans', size: 12 } }
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#44445a' } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#44445a' } },
    },
  };

  const chartData = buildChartData();

  return (
    <div className="page playground-page">
      {/* Header */}
      <div className="pg-header fade-up">
        <div className="pg-tag">// interactive ml algorithms</div>
        <h1 className="pg-title">ML <span className="pg-title-accent">Playground</span></h1>
        <p className="pg-sub">Select an algorithm, configure parameters, run and visualise results instantly.</p>
      </div>

      <div className="pg-layout">
        {/* Left Panel */}
        <div className="pg-panel fade-up-1">
          <div className="card">
            <p className="section-label">// select algorithm</p>
            <div className="algo-list">
              {ALGORITHMS.map(a => (
                <div
                  key={a.id}
                  className={`algo-item ${selected === a.id ? 'active' : ''}`}
                  style={{ '--algo-color': a.color }}
                  onClick={() => { setSelected(a.id); setResult(null); setSaved(false); }}
                >
                  <div className="algo-dot" />
                  <div>
                    <p className="algo-name">{a.label}</p>
                    <p className="algo-desc">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card params-card">
            <p className="section-label">// parameters</p>
            <div className="param-row">
              <label>Sample Size (n)</label>
              <div className="param-input-wrap">
                <input
                  type="range" min="20" max="200" step="10"
                  value={params.n}
                  onChange={e => setParams(p => ({ ...p, n: +e.target.value }))}
                />
                <span className="param-val">{params.n}</span>
              </div>
            </div>
            {selected === 'kmeans' && (
              <div className="param-row">
                <label>Clusters (k)</label>
                <div className="param-input-wrap">
                  <input
                    type="range" min="2" max="6" step="1"
                    value={params.k}
                    onChange={e => setParams(p => ({ ...p, k: +e.target.value }))}
                  />
                  <span className="param-val">{params.k}</span>
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary run-btn" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" /> running...</> : '▶ RUN ALGORITHM'}
          </button>

          {result && !saved && (
            <button className="btn btn-ghost save-btn" onClick={save}>💾 Save Experiment</button>
          )}
          {saved && <div className="saved-msg">✓ Saved to history!</div>}
          {error && <div className="error-msg">⚠ {error}</div>}
        </div>

        {/* Right Panel */}
        <div className="pg-results fade-up-2">
          {!result && !loading && (
            <div className="card empty-state">
              <div className="empty-icon">{'{ }'}</div>
              <p className="empty-title">No results yet</p>
              <p className="empty-sub">Configure parameters and click RUN ALGORITHM</p>
            </div>
          )}

          {loading && (
            <div className="card empty-state">
              <div className="loading-ring" />
              <p className="empty-title">Running algorithm...</p>
              <p className="empty-sub">Generating data and computing results</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Metrics */}
              <div className="metrics-row">
                {result.algorithm === 'linear_regression' && (
                  <>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#00e5ff'}}>{result.results.r2}</p><p className="metric-label">R² Score</p></div>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#a855f7'}}>{result.results.slope}</p><p className="metric-label">Slope</p></div>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#f97316'}}>{result.results.intercept}</p><p className="metric-label">Intercept</p></div>
                  </>
                )}
                {result.algorithm === 'kmeans' && (
                  <>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#a855f7'}}>{result.results.k}</p><p className="metric-label">Clusters</p></div>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#00e5ff'}}>{result.results.points?.length}</p><p className="metric-label">Points</p></div>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#22c55e'}}>{result.results.centroids?.length}</p><p className="metric-label">Centroids</p></div>
                  </>
                )}
                {result.algorithm === 'logistic_regression' && (
                  <>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#22c55e'}}>{result.results.accuracy}%</p><p className="metric-label">Accuracy</p></div>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#00e5ff'}}>{result.results.weights?.w1}</p><p className="metric-label">Weight 1</p></div>
                    <div className="metric-card card"><p className="metric-val" style={{color:'#a855f7'}}>{result.results.weights?.w2}</p><p className="metric-label">Weight 2</p></div>
                  </>
                )}
              </div>

              {/* Chart */}
              {chartData && (
                <div className="card chart-card">
                  <p className="section-label">// visualisation</p>
                  <div className="chart-wrap">
                    <Scatter data={chartData} options={chartOptions} />
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {result.insights && (
                <div className="card insights-card">
                  <p className="section-label">// ai insights</p>
                  <p className="insights-text">{result.insights}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
