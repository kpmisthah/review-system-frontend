import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestReview from './pages/RequestReview';
import PendingRequests from './pages/PendingRequests';
import MyReviews from './pages/MyReviews';
import './App.css';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-review"
        element={
          <ProtectedRoute>
            <Navbar />
            <RequestReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pending-requests"
        element={
          <ProtectedRoute requireSenior>
            <Navbar />
            <PendingRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-reviews"
        element={
          <ProtectedRoute>
            <Navbar />
            <MyReviews />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard or login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
