import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ================= HERO ================= */}

        <section className="hero-section">
          <div className="container">
            <div className="hero-grid">

              <div>
                <span className="eyebrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 2l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 13.6 6.9 17.2l1.9-5.8L4 7.8h6.1z" />
                  </svg>

                  Built for students
                </span>

                <h1 className="hero-title">
                  Turn student ideas
                  <span className="light">
                    into real change.
                  </span>
                </h1>

                <p className="hero-sub">
                  A collaborative space where students can
                  share ideas, start conversations, and vote
                  for the changes they want to see on campus.
                </p>

                <div className="hero-actions">
                  <Link
                    to="/signup"
                    className="btn btn-primary"
                  >
                    Share Your Idea →
                  </Link>

                  <Link
                    to="/ideas"
                    className="btn btn-secondary"
                  >
                    Explore Ideas
                  </Link>
                </div>

                <p className="trust-line">
                  Share ideas. Get feedback. Make an impact.
                </p>
              </div>

              {/* CORKBOARD */}

              <div className="board">

                <div className="note n1">
                  <span className="note-edge" />

                  <div className="note-cat">
                    CAMPUS
                  </div>

                  <div className="note-title">
                    Smart Campus Navigation
                  </div>

                  <div className="note-foot">
                    <span>↑ 24</span>
                    <span>💬 8</span>
                  </div>
                </div>

                <div className="note n2">
                  <span className="note-edge" />

                  <div className="note-cat">
                    TECHNOLOGY
                  </div>

                  <div className="note-title">
                    Offline Class Notes App
                  </div>

                  <div className="note-foot">
                    <span>↑ 31</span>
                    <span>💬 11</span>
                  </div>
                </div>

                <div className="note n3">
                  <span className="note-edge" />

                  <div className="note-cat">
                    EDUCATION
                  </div>

                  <div className="note-title">
                    Free Textbook Exchange
                  </div>

                  <div className="note-foot">
                    <span>↑ 19</span>
                    <span>💬 6</span>
                  </div>
                </div>

                <div className="note n4">
                  <span className="note-edge" />

                  <div className="note-cat">
                    EVENTS
                  </div>

                  <div className="note-title">
                    Unified Events Calendar
                  </div>

                  <div className="note-foot">
                    <span>↑ 22</span>
                    <span>💬 9</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}

        <section className="container section">
          <div className="section-head">
            <h2>
              Ideas grow when students work together.
            </h2>

            <p>
              A simple loop: post, discuss, and vote —
              built to help good ideas rise to the top.
            </p>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <div className="step-num">
                01
              </div>

              <div className="step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4v16" />
                  <path d="M20 12H4" />
                </svg>
              </div>

              <h3>Share</h3>

              <p>
                Post your idea with a title, category
                and clear description.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">
                02
              </div>

              <div className="step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h3>Discuss</h3>

              <p>
                Get feedback and continue the conversation
                with other students.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">
                03
              </div>

              <div className="step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </div>

              <h3>Vote</h3>

              <p>
                Upvote ideas you believe can make
                a difference on campus.
              </p>
            </div>

          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="cta-band">
          <div className="cta-watermark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18h6" />
              <path d="M10 21h4" />
              <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
            </svg>
          </div>

          <div className="cta-copy">
            <h2>
              Have an idea
              <span className="light">
                worth sharing?
              </span>
            </h2>

            <p>
              Start the conversation with your college
              community.
            </p>

            <Link
              to="/create"
              className="btn btn-blue"
            >
              Create an Idea →
            </Link>

            <p className="cta-note">
              Free to join with your college email.
            </p>
          </div>
        </section>

        <div className="container">
          <footer>
            <span>© 2026 IdeaBoard</span>
            <span>Made for students, by students</span>
          </footer>
        </div>
      </main>
    </>
  );
}