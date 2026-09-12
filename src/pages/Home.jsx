import { Link } from "react-router-dom";

export default function IdeaCard({ idea, voteCount = 0 }) {
  const author =
    idea.profiles?.full_name ||
    idea.profiles?.username ||
    "Student";

  return (
    <article className="idea-card">
      <div className="idea-card-top">
        <span className="category-badge">
          {idea.category}
        </span>

        <span className="vote-count">
          ▲ {voteCount}
        </span>
      </div>

      <h2>{idea.title}</h2>

      <p className="idea-preview">
        {idea.description.length > 155
          ? `${idea.description.slice(0, 155)}...`
          : idea.description}
      </p>

      <div className="idea-card-footer">
        <div className="author-mini">
          <span className="mini-avatar">
            {author.charAt(0).toUpperCase()}
          </span>

          <span>{author}</span>
        </div>

        <Link
          to={`/ideas/${idea.id}`}
          className="view-link"
        >
          View →
        </Link>
      </div>
    </article>
  );
}