import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="landing-logo">
      <span className="landing-logo-mark">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M12 3v14" />
          <path d="M6 21h12" />
        </svg>
      </span>

      <span>IdeaBoard</span>
    </Link>
  );
}

function IdeaNote({
  className,
  category,
  title,
  votes,
  comments,
}) {
  return (
    <div className={`idea-note ${className || ""}`}>
      <span className="idea-note-edge"></span>

      <span className="idea-note-pin"></span>

      <div className="idea-note-category">
        {category}
      </div>

      <div className="idea-note-title">
        {title}
      </div>

      <div className="idea-note-footer">
        <span>↑ {votes}</span>
        <span>💬 {comments}</span>
      </div>
    </div>
  );
}

function IdeaBoardPreview() {
  return (
    <div className="landing-board">
      <IdeaNote
        className="idea-note-campus"
        category="CAMPUS"
        title="Smart Campus Navigation"
        votes="24"
        comments="8"
      />

      <IdeaNote
        className="idea-note-technology"
        category="TECHNOLOGY"
        title="Offline Class Notes App"
        votes="31"
        comments="11"
      />

      <IdeaNote
        className="idea-note-education"
        category="EDUCATION"
        title="Free Textbook Exchange"
        votes="19"
        comments="6"
      />

      <IdeaNote
        className="idea-note-events"
        category="EVENTS"
        title="Unified Events Calendar"
        votes="22"
        comments="9"
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="landing-page">
      {/* ================= NAVBAR ================= */}

      <header className="landing-navbar">
        <Logo />

        <nav className="landing-nav-links">
          <Link to="/ideas">Ideas</Link>

          <Link to="/login">Log In</Link>

          <Link
            to="/signup"
            className="landing-signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}

      <main>
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <div className="landing-copy">
              <div className="landing-kicker">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 2l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 13.6 6.9 17.2l1.9-5.8L4 7.8h6.1z" />
                </svg>

                <span>Built for students</span>
              </div>

              <h1 className="landing-title">
                Turn student ideas
                <span>into real change.</span>
              </h1>

              <p className="landing-description">
                A collaborative space where students can share
                ideas, start conversations, and vote for the
                changes they want to see on campus.
              </p>

              <div className="landing-cta-row">
                <Link
                  to="/signup"
                  className="landing-primary-button"
                >
                  Share Your Idea
                  <span>→</span>
                </Link>

                <Link
                  to="/ideas"
                  className="landing-secondary-button"
                >
                  Explore Ideas
                </Link>
              </div>

              <p className="landing-trust">
                Share ideas. Get feedback. Make an impact.
              </p>
            </div>

            {/* ================= IDEA BOARD ================= */}

            <IdeaBoardPreview />
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}

        <section className="landing-how">
          <div className="landing-section-heading">
            <span>HOW IT WORKS</span>

            <h2>
              Ideas grow when students
              work together.
            </h2>

            <p>
              A simple loop: post, discuss, and vote —
              built to help good ideas rise to the top.
            </p>
          </div>

          <div className="landing-steps">
            <article>
              <div className="landing-step-number">
                01
              </div>

              <div className="landing-step-icon">
                +
              </div>

              <h3>Share</h3>

              <p>
                Post your idea with a title, category
                and clear description.
              </p>
            </article>

            <article>
              <div className="landing-step-number">
                02
              </div>

              <div className="landing-step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h3>Discuss</h3>

              <p>
                Get feedback and continue the conversation
                with other students.
              </p>
            </article>

            <article>
              <div className="landing-step-number">
                03
              </div>

              <div className="landing-step-icon">
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
              </div>

              <h3>Vote</h3>

              <p>
                Upvote ideas you believe can make
                a difference on campus.
              </p>
            </article>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}

        <section className="landing-final-cta">
          <div className="landing-cta-copy">
            <span>YOUR VOICE MATTERS</span>

            <h2>
              Have an idea
              <span>worth sharing?</span>
            </h2>

            <p>
              Start the conversation with your
              college community.
            </p>

            <Link
              to="/create"
              className="landing-cta-button"
            >
              Create an Idea
              <span>→</span>
            </Link>

            <small>
              Free to join with your college email.
            </small>
          </div>

          <div className="landing-cta-decoration">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
            </svg>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="landing-footer">
          <span>© 2026 IdeaBoard</span>

          <span>
            Made for students, by students
          </span>
        </footer>
      </main>
    </div>
  );
}