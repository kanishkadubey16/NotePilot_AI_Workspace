import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#0f172a', marginBottom: '10px' }}>Dashboard</h1>
      <p style={{ color: '#475569', fontSize: '1.1rem' }}>Welcome back, {user?.name}!</p>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        {/* Placeholder Stat Cards */}
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', flex: 1 }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 10px 0' }}>Total Notes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>0</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', flex: 1 }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 10px 0' }}>AI Usage</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#4f46e5' }}>0 requests</p>
        </div>
      </div>
    </div>
  );
}
