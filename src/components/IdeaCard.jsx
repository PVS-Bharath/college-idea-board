import { Link } from "react-router-dom";

const categoryVariables = {
  Technology: "var(--cat-technology)",
  Campus: "var(--cat-campus)",
  Education: "var(--cat-education)",
  Events: "var(--cat-events)",
  Environment: "var(--cat-environment)",
  Other: "var(--cat-other)",
};

export default function IdeaCard({
  idea,
  voteCount = 0,
  hasVoted = false,
  onVote,
}) {
  const categoryColor =
    categoryVariables[idea.category] ||
    "var(--blue)";

  const author =
    idea.profiles?.full_name ||
    idea.profiles?.username ||
    "Student";

  const commentCount =
    idea.comments?.[0]?.count ??
    idea.comment_count ??
    0;

  return (
    <article
      className="idea-card"
      style={{ "--cat": categoryColor }}
    >
      <Link to={`/ideas/${idea.id}`}>
        <span className="badge">
          {idea.category?.toUpperCase()}
        </span>

        <h3>{idea.title}</h3>

        <p className="desc">
          {idea.description}
        </p>

        <span className="idea-meta">
          Posted by {author} ·{" "}
          {new Date(idea.created_at).toLocaleDateString()}
        </span>
      </Link>

      <div className="idea-foot">
        <div className="idea-stats">
          <span>
            💬 {commentCount}
          </span>
        </div>

        <button
          type="button"
          className={`vote-btn ${
            hasVoted ? "voted" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onVote?.(idea.id);
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>

          <span>{voteCount}</span>
        </button>
      </div>
    </article>
  );
}