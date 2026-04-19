import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CursorGlow from './components/CursorGlow';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ChatHub from './pages/ChatHub';
import CategoryPage from './pages/CategoryPage';
import ProjectCollab from './pages/ProjectCollab';
import Matches from './pages/Matches';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Search from './pages/Search';
import SwapRequests from './pages/SwapRequests';
import Sessions from './pages/Sessions';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';

// A wrapper component to handle the layout for authenticated routes
const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user || location.pathname === '/') {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <div className="app-container">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Overlay for mobile sidebar */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="main-wrapper">
        <TopBar setMobileOpen={setMobileOpen} />
        <main className="main-content">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
      <CursorGlow />
    </div>
  );
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Landing />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/matches"
            element={user ? <Matches /> : <Navigate to="/login" />}
          />
          <Route
            path="/project-collab"
            element={user ? <ProjectCollab /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={user ? <ChatHub /> : <Navigate to="/login" />}
          />

          <Route
            path="/swaps"
            element={user ? <SwapRequests /> : <Navigate to="/login" />}
          />
          <Route
            path="/sessions"
            element={user ? <Sessions /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/resources"
            element={user ? <Resources /> : <Navigate to="/login" />}
          />
          <Route
            path="/community"
            element={user ? <Community /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaderboard"
            element={user ? <Leaderboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

