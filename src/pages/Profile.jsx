import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: ideasData } = await supabase
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
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setProfile(profileData);
    setIdeas(ideasData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <LoadingSkeleton />
        </main>
      </>
    );
  }

  const displayName =
    profile?.full_name ||
    profile?.username ||
    "Student";

  return (
    <>
      <Navbar />

      <main className="page-container">
        <section className="profile-header">
          <div className="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <span className="section-label">
              PROFILE
            </span>

            <h1>{displayName}</h1>

            <p>
              @{profile?.username || "student"}
            </p>

            <span className="profile-stat">
              {ideas.length}{" "}
              {ideas.length === 1
                ? "idea"
                : "ideas"}{" "}
              shared
            </span>
          </div>
        </section>

        <section>
          <div className="section-heading">
            <span className="section-label">
              YOUR CONTRIBUTIONS
            </span>

            <h2>Your Ideas</h2>
          </div>

          {ideas.length === 0 ? (
            <div className="empty-state large">
              <div className="state-icon">+</div>

              <h2>No ideas yet</h2>

              <p>
                Ideas you share with the community will
                appear here.
              </p>
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  voteCount={idea.votes?.length || 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}