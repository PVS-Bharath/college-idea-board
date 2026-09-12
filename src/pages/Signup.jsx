import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      setError(
        "Please complete all fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      username: username.trim(),
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/ideas");
  };

  return (
    <>
      <Navbar />

      <main className="auth-wrap">
        <div className="auth-card">
          <h1>Join IdeaBoard</h1>

          <p className="form-sub">
            Create your account and start sharing
            ideas.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label>Username</label>

              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label>Email</label>

              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />
            </div>

            <div
              className="field"
              style={{ marginBottom: "8px" }}
            >
              <label>Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{
                marginTop: "14px",
                padding: "12px",
              }}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}