import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({
  ideaId,
  comments,
  onCommentAdded,
}) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleComment = async (event) => {
    event.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (!user) {
      setError("Please login to comment.");
      return;
    }

    setSubmitting(true);

    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        content: content.trim(),
      })
      .select(`
        *,
        profiles (
          full_name,
          username
        )
      `)
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setContent("");
    onCommentAdded(data);
  };

  return (
    <section className="comments-section">
      <h2>Discussion</h2>

      {user && (
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            maxLength={500}
          />

          <button className="primary-button" disabled={submitting}>
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-state">
            <p>No comments yet.</p>
            <span>Be the first to start the discussion.</span>
          </div>
        ) : (
          comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="comment-header">
                <strong>
                  {comment.profiles?.full_name ||
                    comment.profiles?.username ||
                    "Student"}
                </strong>

                <span>
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>

              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}