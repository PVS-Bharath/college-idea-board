import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const categories = [
  "All",
  "Technology",
  "Campus",
  "Education",
  "Events",
  "Environment",
  "Other",
];

export default function Ideas() {
  const { user } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [votedIdeas, setVotedIdeas] = useState(
    new Set()
  );

  const fetchIdeas = async () => {
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
        ),
        comments (
          id
        )
      `)
      .is("group_id", null)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setError(error.message);
      setIdeas([]);
      setLoading(false);
      return;
    }

    setIdeas(data || []);

    if (user) {
      const voted = new Set();

      (data || []).forEach((idea) => {
        if (
          idea.votes?.some(
            (vote) => vote.user_id === user.id
          )
        ) {
          voted.add(idea.id);
        }
      });

      setVotedIdeas(voted);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, [user]);

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (idea) =>
          idea.title
            ?.toLowerCase()
            .includes(query) ||
          idea.description
            ?.toLowerCase()
            .includes(query) ||
          idea.category
            ?.toLowerCase()
            .includes(query)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (idea) => idea.category === category
      );
    }

    if (sort === "Most Upvoted") {
      result.sort(
        (a, b) =>
          (b.votes?.length || 0) -
          (a.votes?.length || 0)
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );
    }

    return result;
  }, [ideas, search, category, sort]);

  const handleVote = async (ideaId) => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    const alreadyVoted = votedIdeas.has(ideaId);

    if (alreadyVoted) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("idea_id", ideaId)
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("votes")
        .insert({
          idea_id: ideaId,
          user_id: user.id,
        });

      if (error) {
        alert(error.message);
        return;
      }
    }

    setVotedIdeas((previous) => {
      const next = new Set(previous);

      if (alreadyVoted) {
        next.delete(ideaId);
      } else {
        next.add(ideaId);
      }

      return next;
    });

    setIdeas((previous) =>
      previous.map((idea) => {
        if (idea.id !== ideaId) {
          return idea;
        }

        const votes = [...(idea.votes || [])];

        if (alreadyVoted) {
          const index = votes.findIndex(
            (vote) => vote.user_id === user.id
          );

          if (index !== -1) {
            votes.splice(index, 1);
          }
        } else {
          votes.push({
            user_id: user.id,
          });
        }

        return {
          ...idea,
          votes,
        };
      })
    );
  };

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="page-head">
          <h1>Discover Ideas</h1>

          <p>
            Explore what students in your community
            are thinking about.
          </p>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>

            <input
              type="text"
              placeholder="Search ideas..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            className="sort-select"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >
            <option>Newest</option>
            <option>Most Upvoted</option>
          </select>

          {user && (
            <Link
              to="/create"
              className="btn btn-primary"
            >
              + Create Idea
            </Link>
          )}
        </div>

        <div
          className="filter-chips"
          style={{ marginBottom: "22px" }}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${
                category === item ? "on" : ""
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="error-state">
            <h3>Unable to load ideas.</h3>

            <p>
              Please check your connection and try
              again.
            </p>

            <button
              className="btn btn-primary"
              onClick={fetchIdeas}
            >
              Try Again
            </button>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet.</h3>

            <p>
              Be the first student to share an idea.
            </p>

            {user && (
              <Link
                to="/create"
                className="btn btn-blue"
              >
                Create the First Idea →
              </Link>
            )}
          </div>
        ) : (
          <div className="idea-grid">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                voteCount={idea.votes?.length || 0}
                hasVoted={votedIdeas.has(idea.id)}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}