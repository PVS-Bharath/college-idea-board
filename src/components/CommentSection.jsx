import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function CommentSection({
  ideaId,
}) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles (
          full_name,
          username
        )
      `)
      .eq("idea_id", ideaId)
      .order("created_at", {
        ascending: true,
      });

    if (!error) {
      setComments(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const postComment = async () => {
    if (!user) {
      alert("Please log in to comment.");
      return;
    }

    if (!content.trim()) {
      return;
    }

    if (content.trim().length < 2) {
      alert("Comment is too short.");
      return;
    }

    setPosting(true);

    const { error } = await supabase
      .from("comments")
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        content: content.trim(),
      });

    setPosting(false);

    if (error) {
      alert(error.message);
      return;
    }

    setContent("");

    await fetchComments();
  };

  const deleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    setComments((previous) =>
      previous.filter(
        (comment) => comment.id !== commentId
      )
    );
  };

  if (loading) {
    return <p className="idea-meta">Loading discussion...</p>;
  }

  return (
    <div className="discussion">
      <h3>Discussion</h3>

      {user && (
        <div className="comment-box">
          <div className="avatar">
            {(
              user.user_metadata?.full_name ||
              user.email ||
              "Y"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="comment-input-wrap">
            <textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
            />

            <div className="comment-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={postComment}
                disabled={posting}
              >
                {posting
                  ? "Posting..."
                  : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="idea-meta">
          No comments yet. Start the conversation.
        </p>
      ) : (
        comments.map((comment) => {
          const name =
            comment.profiles?.full_name ||
            comment.profiles?.username ||
            "Student";

          const isOwner =
            comment.user_id === user?.id;

          return (
            <div
              className="comment-item"
              key={comment.id}
            >
              <div className="avatar">
                {name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="comment-content">
                <div className="comment-head">
                  <span className="comment-name">
                    {name}
                  </span>

                  <span className="comment-time">
                    {new Date(
                      comment.created_at
                    ).toLocaleString()}
                  </span>
                </div>

                <p className="comment-text">
                  {comment.content}
                </p>

                {isOwner && (
                  <div className="comment-owner-actions">
                    <button
                      onClick={() =>
                        deleteComment(comment.id)
                      }
                      style={{
                        color:
                          "var(--danger)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}