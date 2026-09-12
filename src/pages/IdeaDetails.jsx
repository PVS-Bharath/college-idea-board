import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const categoryVariables = {
  Technology: "var(--cat-technology)",
  Campus: "var(--cat-campus)",
  Education: "var(--cat-education)",
  Events: "var(--cat-events)",
  Environment: "var(--cat-environment)",
  Other: "var(--cat-other)",
};

export default function IdeaDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voted, setVoted] = useState(false);

  const loadIdea = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("ideas")
      .select(`
        *,
        profiles (
          full_name,
          username
        ),
        votes (
          id,
          user_id
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setIdea(data);

    if (user) {
      setVoted(
        data.votes?.some(
          (vote) => vote.user_id === user.id
        ) || false
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadIdea();
  }, [id, user]);

  const handleVote = async () => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    if (voted) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("idea_id", id)
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setVoted(false);

      setIdea((previous) => ({
        ...previous,
        votes: previous.votes.filter(
          (vote) =>
            vote.user_id !== user.id
        ),
      }));

      return;
    }

    const { data, error } = await supabase
      .from("votes")
      .insert({
        idea_id: id,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setVoted(true);

    setIdea((previous) => ({
      ...previous,
      votes: [
        ...(previous.votes || []),
        data,
      ],
    }));
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Delete this idea? This cannot be undone."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/profile");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-loading">
          <div className="spinner"></div>
          <p>Loading idea...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="container">
          <div className="detail-wrap">
            <div className="error-state">
              <h3>
                Unable to load this idea.
              </h3>

              <p>{error}</p>

              <Link
                to="/ideas"
                className="btn btn-primary"
              >
                Back to Ideas
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!idea) return null;

  const author =
    idea.profiles?.full_name ||
    idea.profiles?.username ||
    "Student";

  const isOwner =
    user?.id === idea.user_id;

  const categoryColor =
    categoryVariables[idea.category] ||
    "var(--blue)";

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="detail-wrap">

          {/* BACK */}

          <Link
            to="/ideas"
            className="back-link"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="19"
                y1="12"
                x2="5"
                y2="12"
              />

              <polyline points="12 19 5 12 12 5" />
            </svg>

            Back to Ideas
          </Link>

          {/* IDEA */}

          <article
            className="detail-card"
            style={{
              "--cat": categoryColor,
            }}
          >
            {/* CATEGORY */}

            <span className="badge">
              {idea.category?.toUpperCase()}
            </span>

            {/* TITLE */}

            <h1 className="detail-title">
              {idea.title}
            </h1>

            {/* META */}

            <div className="detail-meta-row">
              <span>
                Posted by {author}
              </span>

              <span>·</span>

              <span>
                {new Date(
                  idea.created_at
                ).toLocaleString()}
              </span>
            </div>

            {/* DESCRIPTION */}

            <p className="detail-body">
              {idea.description}
            </p>

            {/* ACTIONS */}

            <div className="detail-actions">

              {/* VOTE */}

              <button
                type="button"
                className={`vote-btn ${
                  voted ? "voted" : ""
                }`}
                onClick={handleVote}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="5"
                  />

                  <polyline points="5 12 12 5 19 12" />
                </svg>

                <span>
                  {voted
                    ? "Voted"
                    : "Upvote"}{" "}
                  · {idea.votes?.length || 0}
                </span>
              </button>

              {/* OWNER ACTIONS */}

              {isOwner && (
                <div className="owner-actions">

                  <Link
                    to={`/edit/${idea.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit Idea
                  </Link>

                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    onClick={handleDelete}
                  >
                    Delete Idea
                  </button>

                </div>
              )}
            </div>

            {/* DISCUSSION */}

            <CommentSection
              ideaId={idea.id}
            />
          </article>
        </div>
      </main>
    </>
  );
}