import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const AI_COLORS = {
  summary: '#06b6d4',
  'action-items': '#8b5cf6',
  title: '#3b82f6',
  tags: '#10b981',
  improve: '#f59e0b'
};
const AI_LABELS = {
  summary: 'Summary',
  'action-items': 'Action Items',
  title: 'Suggest Title',
  tags: 'Suggest Tags',
  improve: 'Improve'
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function DonutChart({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', border: '12px solid var(--border-main)' }}/>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No AI usage yet</span>
    </div>
  );

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = Object.entries(data).filter(([, v]) => v > 0).map(([key, value]) => {
    const pct = value / total;
    const dash = pct * circumference;
    const seg = { key, value, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 100 100" className="donut-svg">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border-main)" strokeWidth="12"/>
        {segments.map(s => (
          <circle
            key={s.key}
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={AI_COLORS[s.key]}
            strokeWidth="12"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={circumference / 4 - s.offset}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        if (data.success) setStats(data.stats);
      } catch (error) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="db-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const weekly = stats?.weeklyActivity || [];
  const maxBar = Math.max(...weekly.map(d => d.count), 1);
  const tags = stats?.mostUsedTags || [];
  const maxTag = Math.max(...tags.map(t => t.count), 1);
  const aiBreakdown = stats?.aiUsageBreakdown || {};
  const recent = stats?.recentlyEdited || [];

  return (
    <div className="db-page">
      {/* Header */}
      <div className="db-header">
        <span className="db-breadcrumb">DASHBOARD</span>
        <h1 className="db-title">Productivity overview</h1>
      </div>

      {/* Stat Cards */}
      <div className="db-stats-grid">
        <div className="db-stat-card">
          <div className="db-stat-top">
            <span className="db-stat-label">TOTAL NOTES</span>
            <span className="db-stat-icon">📄</span>
          </div>
          <div className="db-stat-number">{stats?.totalNotes ?? 0}</div>
          <div className="db-stat-sub">Active notes</div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-top">
            <span className="db-stat-label">ARCHIVED</span>
            <span className="db-stat-icon">📦</span>
          </div>
          <div className="db-stat-number">{stats?.archivedNotes ?? 0}</div>
          <div className="db-stat-sub">In archive</div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-top">
            <span className="db-stat-label">SHARED</span>
            <span className="db-stat-icon">🔗</span>
          </div>
          <div className="db-stat-number">{stats?.sharedNotes ?? 0}</div>
          <div className="db-stat-sub">Public links</div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-top">
            <span className="db-stat-label">AI CALLS</span>
            <span className="db-stat-icon">✨</span>
          </div>
          <div className="db-stat-number">{stats?.aiUsageCount ?? 0}</div>
          <div className="db-stat-sub">All-time</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="db-charts-row">
        {/* Weekly Bar Chart */}
        <div className="db-card db-chart-card">
          <div className="db-card-label">WEEKLY</div>
          <div className="db-card-title">Notes created · last 7 days</div>
          <div className="db-bar-chart">
            {weekly.map((d, i) => (
              <div key={i} className="db-bar-col">
                <div className="db-bar-track">
                  <div 
                    className="db-bar-fill"
                    style={{ height: `${(d.count / maxBar) * 100}%` }}
                    title={`${d.count} notes`}
                  />
                </div>
                <span className="db-bar-label">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="db-bar-y-axis">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{Math.round((maxBar / 4) * (4 - i))}</span>
            ))}
          </div>
        </div>

        {/* AI Donut Chart */}
        <div className="db-card db-donut-card">
          <div className="db-card-label">AI USAGE</div>
          <div className="db-card-title">By action</div>
          <div className="db-donut-body">
            <DonutChart data={aiBreakdown} />
            <div className="db-donut-legend">
              {Object.entries(AI_LABELS).map(([key, label]) => (
                <div key={key} className="db-legend-row">
                  <span className="db-legend-dot" style={{ background: AI_COLORS[key] }}/>
                  <span className="db-legend-label">{label}</span>
                  <span className="db-legend-count">{aiBreakdown[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="db-bottom-row">
        {/* Top Tags */}
        <div className="db-card">
          <div className="db-card-label">TOP TAGS</div>
          <div className="db-card-title">Most used</div>
          {tags.length === 0 ? (
            <p className="db-empty">No tags yet. Add tags to your notes!</p>
          ) : (
            <div className="db-tags-list">
              {tags.map((tag, i) => (
                <div key={i} className="db-tag-row">
                  <span className="db-tag-name">#{tag.name}</span>
                  <div className="db-tag-bar-track">
                    <div 
                      className="db-tag-bar-fill"
                      style={{ width: `${(tag.count / maxTag) * 100}%` }}
                    />
                  </div>
                  <span className="db-tag-count">{tag.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="db-card">
          <div className="db-card-label">ACTIVITY</div>
          <div className="db-card-title">Recent updates</div>
          {recent.length === 0 ? (
            <p className="db-empty">No recent activity.</p>
          ) : (
            <div className="db-activity-list">
              {recent.map((note, i) => (
                <div 
                  key={i} 
                  className="db-activity-row"
                  onClick={() => navigate('/workspace')}
                >
                  <span className="db-activity-icon">📄</span>
                  <span className="db-activity-title">{note.title || 'Untitled'}</span>
                  <span className="db-activity-time">{timeAgo(note.updatedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
