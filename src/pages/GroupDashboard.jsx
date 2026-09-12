import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function GroupDashboard() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [ideas, setIdeas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGroup = async () => {
      if (!user || !groupId) {
        setError("Missing user or group.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Load group
        const {
          data: groupData,
          error: groupError,
        } = await supabase
          .from("groups")
          .select("*")
          .eq("id", groupId)
          .maybeSingle();

        if (groupError) {
          throw groupError;
        }

        if (!groupData) {
          throw new Error(
            "Group not found or you do not have access to this group."
          );
        }

        setGroup(groupData);

        // Load member count
        const {
          data: members,
          error: membersError,
        } = await supabase
          .from("group_members")
          .select("id")
          .eq("group_id", groupId);

        if (membersError) {
          console.error(
            "Member query error:",
            membersError
          );
        }

        setMemberCount(
          members?.length || 0
        );

        // Load ideas
        const {
          data: ideasData,
          error: ideasError,
        } = await supabase
          .from("ideas")
          .select(
            "id, user_id, group_id, title, description, category, visibility, image_url, created_at"
          )
          .eq("group_id", groupId)
          .order("created_at", {
            ascending: false,
          });

        if (ideasError) {
          console.error(
            "Ideas query error:",
            ideasError
          );
        }

        setIdeas(ideasData || []);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err?.message ||
            "Something went wrong while loading the group."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId, user]);

  const copyCode = async () => {
    if (!group?.join_code) return;

    try {
      await navigator.clipboard.writeText(
        group.join_code
      );

      alert("Join code copied.");
    } catch {
      alert(
        `Join code: ${group.join_code}`
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-loading">
          <div className="spinner" />
          <p>Loading group...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="container">
          <div className="error-state">
            <h3>Unable to load group</h3>

            <p>{error}</p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/host")
              }
            >
              Back to Host
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!group) {
    return null;
  }

  const isHost =
    group.host_id === user?.id;

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="group-dashboard">

          <Link
            to="/host"
            className="back-link"
          >
            ← Back to Host
          </Link>

          <section className="group-dashboard-header">

            <div className="group-dashboard-heading">

              <span className="eyebrow">
                {isHost
                  ? "Your hosted space"
                  : "Group space"}
              </span>

              <h1>
                {group.name}
              </h1>

              <p>
                Share ideas and collaborate with
                everyone in this group.
              </p>

            </div>

            <div className="group-info-card">

              <div className="group-info-item">
                <span>Members</span>
                <strong>
                  {memberCount}
                </strong>
              </div>

              <div className="group-info-divider" />

              <div className="group-info-item">
                <span>Ideas</span>
                <strong>
                  {ideas.length}
                </strong>
              </div>

              <div className="group-info-divider" />

              <div className="group-info-item">
                <span>Join code</span>
                <strong className="group-code">
                  {group.join_code}
                </strong>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={copyCode}
              >
                Copy Code
              </button>

            </div>

          </section>

          <section className="group-actions">

            <div>
              <span className="eyebrow">
                Group ideas
              </span>

              <h2>
                {isHost
                  ? "All submitted ideas"
                  : "Shared ideas"}
              </h2>
            </div>

            <Link
              to={`/create?group=${group.id}`}
              className="btn btn-primary"
            >
              Share an Idea →
            </Link>

          </section>

          {ideas.length === 0 ? (

            <div
              className={
                isHost
                  ? "group-empty-state"
                  : "group-empty-state dark"
              }
            >

              <div className="group-empty-icon">
                ✦
              </div>

              <h3>
                {isHost
                  ? "No ideas have been submitted yet."
                  : "No ideas shared publicly."}
              </h3>

              <p>
                {isHost
                  ? "Ideas submitted by members of this group will appear here."
                  : "No user wants to share their idea publicly. Public ideas will appear here when members choose to share them."}
              </p>

              <Link
                to={`/create?group=${group.id}`}
                className="btn btn-primary"
              >
                Share an Idea →
              </Link>

            </div>

          ) : (

            <div className="group-ideas-list">

              {ideas.map((idea) => {

                const isPrivate =
                  idea.visibility ===
                  "host_only";

                const isOwner =
                  idea.user_id ===
                  user?.id;

                return (
                  <article
                    className="group-idea-card"
                    key={idea.id}
                  >

                    {idea.image_url && (
                      <div className="group-idea-image">
                        <img
                          src={idea.image_url}
                          alt={idea.title}
                        />
                      </div>
                    )}

                    <div className="group-idea-content">

                      <div className="group-idea-top">

                        <span className="badge">
                          {idea.category?.toUpperCase()}
                        </span>

                        <span
                          className={
                            isPrivate
                              ? "visibility-badge private"
                              : "visibility-badge public"
                          }
                        >
                          {isPrivate
                            ? "🔒 HOST ONLY"
                            : "🌎 PUBLIC"}
                        </span>

                      </div>

                      <h3>
                        {idea.title}
                      </h3>

                      <p className="group-idea-description">
                        {idea.description}
                      </p>

                      <div className="group-idea-footer">

                        <span>
                          {isOwner
                            ? "Your idea"
                            : "Submitted by a member"}
                        </span>

                        <Link
                          to={`/ideas/${idea.id}`}
                        >
                          View Idea →
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>
      </main>
    </>
  );
}