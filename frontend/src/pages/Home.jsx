import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">
           <span className="logo-icon">🚀</span> NotePilot
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-item-link">Features</Link>
          <Link to="/workspace" className="nav-item-link">Workspace</Link>
          <Link to="/dashboard" className="nav-item-link">Dashboard</Link>
          <Link to="/login" className="nav-item-link">Sign in</Link>
          <Link to="/signup" className="nav-btn primary">Get started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-badge">
          <span>● New</span> Claude Sonnet 4.5 powered
        </div>
        <h1>The AI workspace <br /> <span className="gradient-text">where ideas ship.</span></h1>
        <p>Capture, organize, and act on every thought. NotePilot turns scattered notes into structured knowledge with AI summaries, action items, and one-click publishing.</p>
        
        <div className="hero-cta">
          <Link to="/signup" className="cta-btn primary">Get started free →</Link>
          <Link to="/login" className="cta-btn secondary">Sign in</Link>
        </div>

        <div className="hero-stats">
          <div className="h-stat">
            <label>AI TOOLS</label>
            <h4>5+</h4>
          </div>
          <div className="h-stat">
            <label>AUTO-SAVE</label>
            <h4>Realtime</h4>
          </div>
          <div className="h-stat">
            <label>MODEL</label>
            <h4>Sonnet 4.5</h4>
          </div>
          <div className="h-stat">
            <label>SHARING</label>
            <h4>Public Links</h4>
          </div>
        </div>
      </main>

      {/* Workspace Preview Section */}
      <section className="preview-section">
        <span className="section-label">THE WORKSPACE</span>
        <h2>Three panels. <span className="gradient-text">Zero friction.</span></h2>
        <p className="subtitle">Sidebar for navigation. Notes list for context. A spacious editor with an AI assistant that lives right where you write.</p>
        
        <div className="mockup-container">
          <div className="mockup-frame">
            <div className="mockup-header">
              <div className="m-dots"><span></span><span></span><span></span></div>
              <div className="m-address">notepilot.app/workspace</div>
            </div>
            <div className="mockup-content">
              <div className="m-sidebar">
                <div className="m-logo">🚀 NotePilot</div>
                <div className="m-nav">
                   <div className="m-nav-item">Dashboard</div>
                   <div className="m-nav-item active">All notes</div>
                   <div className="m-nav-item">Archived</div>
                   <div className="m-nav-item">Shared</div>
                   <div className="m-nav-item">Tags</div>
                   <div className="m-nav-item">Settings</div>
                </div>
              </div>
              <div className="m-list">
                <label>ALL NOTES</label>
                <div className="m-card active">
                   <h5>Q1 product roadmap</h5>
                   <p>Three pillars: speed, reliability, AI...</p>
                </div>
                <div className="m-card">
                   <h5>Investor call · Acme</h5>
                   <p>Discussed runway, hiring plan, and ...</p>
                </div>
                <div className="m-card">
                   <h5>Reading list</h5>
                   <p>Designing Data-Intensive Apps · ...</p>
                </div>
              </div>
              <div className="m-editor">
                <h3>Q1 product roadmap</h3>
                <p className="m-text">We're focusing on three pillars: speed, reliability, and AI-native flows...</p>
                <div className="m-chip">Owner: Maya · ETA: March</div>
                <div className="m-ai-box">
                  <label>✨ AI Summary</label>
                  <p>Q1 will prioritize speed and reliability with an AI-native flow rollout. Maya owns delivery by March.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="dashboard-preview-section">
        <span className="section-label">PRODUCTIVITY DASHBOARD</span>
        <h2>Measure what <span className="gradient-text">moves you.</span></h2>
        <p className="subtitle">See your weekly writing cadence, AI usage breakdown, and most-used tags — all in one control-room view.</p>
        
        <div className="dashboard-mockup">
           <div className="d-mock-stats">
              <div className="d-mock-card">
                 <label>TOTAL NOTES</label>
                 <h4>248</h4>
              </div>
              <div className="d-mock-card">
                 <label>AI CALLS</label>
                 <h4>1.2k</h4>
              </div>
              <div className="d-mock-card">
                 <label>SHARED</label>
                 <h4>12</h4>
              </div>
           </div>
           <div className="d-mock-chart">
              <div className="d-mock-header">
                 <span>WEEKLY</span>
                 <span className="grid-icon">⠿</span>
              </div>
              <div className="d-mock-bars">
                 <div className="m-bar" style={{ height: '30%' }}></div>
                 <div className="m-bar" style={{ height: '60%' }}></div>
                 <div className="m-bar" style={{ height: '40%' }}></div>
                 <div className="m-bar" style={{ height: '90%' }}></div>
                 <div className="m-bar" style={{ height: '50%' }}></div>
                 <div className="m-bar" style={{ height: '70%' }}></div>
                 <div className="m-bar" style={{ height: '45%' }}></div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-section">
        <span className="section-label">AI FEATURES</span>
        <h2>Built for <span className="gradient-text">deep work.</span></h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="f-icon">🧠</div>
            <h3>AI Summaries</h3>
            <p>Distill long notes into crisp 2-line takeaways. Read 10x faster.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">📋</div>
            <h3>Action Items</h3>
            <p>Pull every to-do hiding in your meeting notes into a clean checklist.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">✨</div>
            <h3>Smart Titles</h3>
            <p>Forget naming things. NotePilot suggests the perfect title in one click.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🏷️</div>
            <h3>Auto-Tags</h3>
            <p>Organize by topic automatically. Find anything in seconds.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">✍️</div>
            <h3>Improve Writing</h3>
            <p>Polish tone, fix grammar, tighten prose without losing your voice.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🔗</div>
            <h3>Public Sharing</h3>
            <p>Publish any note as a beautiful read-only page with one toggle.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-final hero-section">
          <h1>Your second brain, <span className="gradient-text">finally fast.</span></h1>
          <p>Free to start. No credit card required.</p>
          <Link to="/signup" className="cta-btn primary" style={{ margin: '0 auto', width: 'fit-content' }}>Start writing ⚡</Link>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
           <div className="logo">🚀 NotePilot</div>
           <p>© 2026 NotePilot · Built with intelligence</p>
        </div>
      </footer>
    </div>
  );
}
