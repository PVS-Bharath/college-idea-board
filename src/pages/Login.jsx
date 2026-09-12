import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    const { error } = await signIn({
      email,
      password,
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
          <h1>Welcome back</h1>

          <p className="form-sub">
            Continue sharing ideas with your
            community.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>

              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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
                ? "Logging in..."
                : "Log In"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}