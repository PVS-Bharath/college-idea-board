import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Ideas from "./pages/Ideas";
import CreateIdea from "./pages/CreateIdea";
import IdeaDetails from "./pages/IdeaDetails";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Ideas page */}
      <Route
        path="/ideas"
        element={
          <ProtectedRoute>
            <Ideas />
          </ProtectedRoute>
        }
      />

      {/* Protected Idea Details */}
      <Route
        path="/ideas/:id"
        element={
          <ProtectedRoute>
            <IdeaDetails />
          </ProtectedRoute>
        }
      />

      {/* Protected Create */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateIdea />
          </ProtectedRoute>
        }
      />

      {/* Protected Edit */}
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <CreateIdea />
          </ProtectedRoute>
        }
      />

      {/* Protected Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}