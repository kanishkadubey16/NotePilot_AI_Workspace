import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to NotePilot AI Workspace</h1>
      <p>Your intelligent, AI-powered notes manager.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
