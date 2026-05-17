import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import '../styles/settings.css';

export default function Settings() {
  const { user, logout, updateProfile, deleteAccount } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { autoSuggestTags, toggleAutoSuggestTags } = useSettings();

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    const ok = await updateProfile(name, email, password || undefined);
    if (ok) {
      setPassword('');
      setEditMode(false);
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await deleteAccount();
    setDeleting(false);
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <span className="settings-subtitle">SETTINGS</span>
        <h1 className="settings-title">Workspace preferences</h1>
      </header>

      <div className="settings-container">

        {/* Profile Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="icon-circle">👤</div>
            <div className="header-text">
              <h2>Profile</h2>
              <p>Your personal info</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              {!editMode ? (
                <button className="action-btn share" onClick={() => setEditMode(true)}>✏️ Edit</button>
              ) : (
                <>
                  <button 
                    className="action-btn share" 
                    onClick={handleSaveProfile} 
                    disabled={saving}
                    style={{ opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? '⏳ Saving...' : '✅ Save'}
                  </button>
                  <button className="action-btn delete" onClick={() => { setEditMode(false); setPassword(''); }}>✕ Cancel</button>
                </>
              )}
            </div>
          </div>

          {!editMode ? (
            <div className="settings-card-body two-columns">
              <div className="input-group">
                <label>NAME</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className="input-group">
                <label>EMAIL</label>
                <input type="text" value={user?.email || ''} readOnly />
              </div>
            </div>
          ) : (
            <div className="settings-card-body two-columns">
              <div className="input-group">
                <label>NAME</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  style={{ color: 'var(--text-main)' }}
                />
              </div>
              <div className="input-group">
                <label>EMAIL</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  style={{ color: 'var(--text-main)' }}
                />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>NEW PASSWORD <span style={{ opacity: 0.5, fontWeight: 400 }}>(leave blank to keep current)</span></label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ color: 'var(--text-main)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Appearance Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="icon-circle">🌙</div>
            <div className="header-text">
              <h2>Appearance</h2>
              <p>Display preferences</p>
            </div>
          </div>
          <div className="settings-card-body flex-row">
            <div className="flex-text">
              <h3>Dark mode</h3>
              <p>Use the high-contrast night theme</p>
            </div>
            <div 
              className={`toggle-switch ${theme === 'dark' ? 'on' : 'off'}`}
              onClick={toggleTheme}
            >
              <div className="toggle-knob"></div>
            </div>
          </div>
        </div>

        {/* AI Preferences Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="icon-circle">✨</div>
            <div className="header-text">
              <h2>AI preferences</h2>
              <p>How the AI assistant behaves</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="flex-row">
              <div className="flex-text">
                <h3>Auto-suggest tags</h3>
                <p>Generate tags on every save (uses more credits)</p>
              </div>
              <div 
                className={`toggle-switch ${autoSuggestTags ? 'on' : 'off'}`}
                onClick={toggleAutoSuggestTags}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div className="flex-row mt-4">
              <div className="flex-text">
                <h3>Model</h3>
                <p>Groq Llama 3.3 70B (default)</p>
              </div>
              <div className="mono-text">llama-3.3-70b</div>
            </div>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="settings-card signout-card">
          <div className="header-text">
            <h2>Sign out</h2>
            <p>You'll need to sign in again to access your workspace.</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            <span>→</span> Log out
          </button>
        </div>

        {/* Danger Zone Card */}
        <div className="settings-card" style={{ border: '1px solid rgba(248, 113, 113, 0.2)' }}>
          <div className="settings-card-header">
            <div className="icon-circle" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>⚠️</div>
            <div className="header-text">
              <h2 style={{ color: '#f87171' }}>Danger Zone</h2>
              <p>Permanent, irreversible actions</p>
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-text">
              <h3>Delete Account</h3>
              <p>Permanently deletes your account and ALL your notes. Cannot be undone.</p>
            </div>
            {!showDeleteConfirm ? (
              <button className="action-btn delete" onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete Account</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#f87171' }}>Are you sure?</span>
                <button 
                  className="action-btn delete"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{ opacity: deleting ? 0.6 : 1 }}
                >
                  {deleting ? '⏳ Deleting...' : '✓ Yes, Delete'}
                </button>
                <button className="action-btn share" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
