import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import IdeaForm from "../components/IdeaForm";
import LoadingSkeleton from "../components/LoadingSkeleton";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function IdeaDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIdea();
  }, [id, user]);

  const fetchIdea = async () => {
    setLoading(true);
    setError("");

    const { data, error: ideaError } = await supabase
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

    if (ideaError) {
      setError(ideaError.message);
      setLoading(false);
      return;
    }

    const { data: commentsData, error: commentsError } =
      await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            full_name,
            username
          )
        `)
        .eq("idea_id", id)
        .order("created_at", { ascending: true });

    if (commentsError) {
      setError(commentsError.message);
      setLoading(false);
      return;
    }

    setIdea(data);
    setVoteCount(data.votes?.length || 0);

    setHasVoted(
      user
        ? data.votes?.some(
            (vote) => vote.user_id === user.id
          )
        : false
    );

    setComments(commentsData || []);
    setLoading(false);
  };

  const handleVote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");

    if (hasVoted) {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("idea_id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setVoteCount((count) => Math.max(0, count - 1));
      setHasVoted(false);
    } else {
      const { error: insertError } = await supabase
        .from("votes")
        .insert({
          idea_id: id,
          user_id: user.id,
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setVoteCount((count) => count + 1);
      setHasVoted(true);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this idea?"
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    navigate("/ideas");
  };

  const handleUpdate = async (updatedIdea) => {
    if (!user) {
      throw new Error("You must be logged in.");
    }

    const { data, error: updateError } = await supabase
      .from("ideas")
      .update({
        title: updatedIdea.title,
        description: updatedIdea.description,
        category: updatedIdea.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select(`
        *,
        profiles (
          full_name,
          username
        )
      `)
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    setIdea(data);
    setEditing(false);
  };

  const handleCommentAdded = (comment) => {
    setComments((current) => [...current, comment]);
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-container narrow">
          <LoadingSkeleton count={1} />
        </main>
      </>
    );
  }

  if (error || !idea) {
    return (
      <>
        <Navbar />

        <main className="page-container narrow">
          <div className="error-state">
            <h2>Unable to load this idea</h2>

            <p>{error || "Idea not found."}</p>

            <Link to="/ideas" className="primary-button">
              Back to Ideas
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (editing) {
    return (
      <>
        <Navbar />

        <main className="page-container narrow">
          <div className="page-header">
            <span className="hero-label">EDIT IDEA</span>

            <h1>Update your idea</h1>
          </div>

          <IdeaForm
            initialData={idea}
            onSubmit={handleUpdate}
          />

          <button
            type="button"
            className="secondary-button cancel-button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </main>
      </>
    );
  }

  const isOwner = user?.id === idea.user_id;

  return (
    <>
      <Navbar />

      <main className="page-container narrow">
        <Link to="/ideas" className="back-link">
          ← Back to Ideas
        </Link>

        <article className="idea-detail">
          <div className="idea-card-top">
            <span className="category-badge">
              {idea.category}
            </span>

            <span>
              {new Date(idea.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1>{idea.title}</h1>

          <div className="author">
            <strong>
              {idea.profiles?.full_name ||
                idea.profiles?.username ||
                "Student"}
            </strong>
          </div>

          <p className="idea-description">
            {idea.description}
          </p>

          <div className="idea-actions">
            <button
              type="button"
              className={`vote-button ${
                hasVoted ? "voted" : ""
              }`}
              onClick={handleVote}
            >
              ▲ {voteCount}{" "}
              {voteCount === 1 ? "Vote" : "Votes"}
            </button>

            {isOwner && (
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </article>

        <CommentSection
          ideaId={id}
          comments={comments}
          onCommentAdded={handleCommentAdded}
        />
      </main>
    </>
  );
}