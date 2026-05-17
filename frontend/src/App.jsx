import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import WorkspaceLayout from './layouts/WorkspaceLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import SharedNote from './pages/SharedNote';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shared/:shareId" element={<SharedNote />} />

          {/* Protected Routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            {/* Wrapped in the 3-Column Layout Shell */}
            <Route element={<WorkspaceLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workspace" element={<Workspace />} />
              {/* Route placeholders for Sidebar links */}
              <Route path="/archived" element={<Workspace />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
