import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] =
    useState(null);

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const [
        profileResult,
        ideasResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single(),

        supabase
          .from("ideas")
          .select(`
            *,
            votes (
              id
            ),
            comments (
              id
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      setProfile(
        profileResult.data || null
      );

      setIdeas(
        ideasResult.data || []
      );

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-loading">
          <div className="spinner" />
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  const displayName =
    profile?.full_name ||
    profile?.username ||
    "Student";

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {displayName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h1 className="profile-name">
              {displayName}
            </h1>

            <p className="profile-sub">
              @{profile?.username || "student"} ·{" "}
              {user?.email}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h2>My Ideas</h2>

          {ideas.length === 0 ? (
            <div className="empty-state">
              <h3>No ideas yet.</h3>

              <p>
                Share your first idea with the
                community.
              </p>

              <Link
                to="/create"
                className="btn btn-blue"
              >
                Create an Idea →
              </Link>
            </div>
          ) : (
            ideas.map((idea) => (
              <div
                className="my-idea-row"
                key={idea.id}
              >
                <div className="my-idea-info">
                  <h4>{idea.title}</h4>

                  <p className="idea-meta">
                    {idea.category} ·{" "}
                    {idea.votes?.length || 0}{" "}
                    votes ·{" "}
                    {idea.comments?.length || 0}{" "}
                    comments ·{" "}
                    {new Date(
                      idea.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="my-idea-actions">
                    <Link
                        to={`/ideas/${idea.id}`}
                        className="btn btn-secondary btn-sm"
                    >
                        View
                    </Link>

                    <Link
                        to={`/edit/${idea.id}`}
                        className="btn btn-secondary btn-sm"
                    >
                        Edit
                    </Link>

                    <button
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => handleDelete(idea.id)}
                    >
                        Delete
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}