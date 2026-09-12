import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-mark">I</span>
          IdeaBoard
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Ideas
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Create
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="nav-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="nav-link"
              >
                Login
              </NavLink>

              <Link to="/signup" className="nav-signup">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}