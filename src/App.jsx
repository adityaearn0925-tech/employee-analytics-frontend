import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import AIAnalytics from './pages/AIAnalytics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
          <Navbar />
          <main>
            <Routes>
              {/* Public Interface Endpoints */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Private Protected Route Guard Channels */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/add-employee" element={
                <ProtectedRoute>
                  <AddEmployee />
                </ProtectedRoute>
              } />
              <Route path="/ai-analytics" element={
                <ProtectedRoute>
                  <AIAnalytics />
                </ProtectedRoute>
              } />

              {/* Catch-All System Routing Fallback Redirection */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;