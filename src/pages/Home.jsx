import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="page-container">
            <div className="hero-content">
              <span className="hero-label">COLLEGE IDEA BOARD</span>

              <h1>
                Share ideas.
                <br />
                Build what matters.
              </h1>

              <p>
                A collaborative space where students can share ideas,
                discover new concepts, discuss possibilities, and vote
                for the ideas they believe in.
              </p>

              <div className="hero-actions">
                <Link to="/ideas" className="primary-button">
                  Explore Ideas
                </Link>

                <Link to="/signup" className="secondary-button">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="home-features">
          <div className="page-container">
            <div className="section-heading">
              <span className="section-label">HOW IT WORKS</span>

              <h2>From idea to community</h2>

              <p>
                Turn your thoughts into ideas that your college
                community can discuss and support.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-number">01</div>

                <h3>Share</h3>

                <p>
                  Publish your idea with a clear title, category,
                  and description.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-number">02</div>

                <h3>Discuss</h3>

                <p>
                  Join conversations and share useful feedback
                  through comments.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-number">03</div>

                <h3>Vote</h3>

                <p>
                  Upvote ideas you think could make a meaningful
                  difference.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <div className="page-container">
            <div className="cta-card">
              <div>
                <span className="section-label">YOUR IDEA MATTERS</span>

                <h2>Have something worth sharing?</h2>

                <p>
                  Start a conversation with your college community.
                </p>
              </div>

              <Link to="/create" className="primary-button">
                Share an Idea
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}