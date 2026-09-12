import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="nav-wrap">
      <div className="nav">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M12 3v14" />
              <path d="M6 21h12" />
            </svg>
          </span>

          IdeaBoard
        </Link>

        <div className="nav-links">
         <Link
            to="/Host"
            className={`nav-link ${
              isActive("/Host") ? "active" : ""
            }`}
          >
            Host
          </Link>

        
          <Link
            to="/ideas"
            className={`nav-link ${
              isActive("/ideas") ? "active" : ""
            }`}
          >
            Ideas
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                className="nav-link"
              >
                Create Idea
              </Link>

              <Link
                to="/profile"
                className="nav-link"
              >
                Profile
              </Link>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
              >
                Log In
              </Link>

              <Link
                to="/signup"
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}