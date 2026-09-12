import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
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
  const [ideas, setIdeas] = useState([]);
  const [votes, setVotes] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("ideas")
      .select(`
        *,
        profiles (
          full_name,
          username
        ),
        votes (
          id
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const voteMap = {};

    data.forEach((idea) => {
      voteMap[idea.id] = idea.votes?.length || 0;
    });

    setIdeas(data || []);
    setVotes(voteMap);
    setLoading(false);
  };

  const filteredIdeas = ideas.filter((idea) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      idea.title.toLowerCase().includes(query) ||
      idea.description.toLowerCase().includes(query);

    const matchesCategory =
      category === "All" ||
      idea.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <main className="page-container">
        <section className="page-header">
          <div>
            <span className="section-label">
              COMMUNITY
            </span>

            <h1>Explore Ideas</h1>

            <p>
              Discover ideas shared by students and join
              the conversation.
            </p>
          </div>
        </section>

        <section className="filter-panel">
          <div className="search-wrapper">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search ideas..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        {!loading && !error && (
          <div className="results-info">
            <span>
              {filteredIdeas.length}{" "}
              {filteredIdeas.length === 1
                ? "idea"
                : "ideas"}
            </span>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="error-state">
            <div className="state-icon">!</div>

            <h2>Couldn't load ideas</h2>

            <p>{error}</p>

            <button
              className="primary-button"
              onClick={fetchIdeas}
            >
              Try Again
            </button>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="empty-state large">
            <div className="state-icon">+</div>

            <h2>No ideas found</h2>

            <p>
              Try a different search or category, or share
              the first idea with your community.
            </p>
          </div>
        ) : (
          <div className="ideas-grid">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                voteCount={votes[idea.id] || 0}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}