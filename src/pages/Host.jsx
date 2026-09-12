import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function generateJoinCode() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return code;
}

export default function Host() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [hostedGroups, setHostedGroups] = useState([]);

  const [loadingGroups, setLoadingGroups] =
    useState(true);

  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const [error, setError] = useState("");

  // ----------------------------------------
  // LOAD HOSTED GROUP HISTORY
  // ----------------------------------------

  useEffect(() => {
    if (!user) {
      setLoadingGroups(false);
      return;
    }

    const loadHostedGroups = async () => {
      setLoadingGroups(true);

      const {
        data,
        error: groupsError,
      } = await supabase
        .from("groups")
        .select(
          "id, name, join_code, created_at, host_id"
        )
        .eq("host_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (groupsError) {
        console.error(
          "Hosted groups error:",
          groupsError
        );

        setError(groupsError.message);
        setLoadingGroups(false);
        return;
      }

      setHostedGroups(data || []);
      setLoadingGroups(false);
    };

    loadHostedGroups();
  }, [user]);

  // ----------------------------------------
  // CREATE GROUP
  // ----------------------------------------

  const createGroup = async () => {
    const name = groupName.trim();

    if (!name) {
      setError("Please enter a group name.");
      return;
    }

    if (name.length < 3) {
      setError(
        "Group name must be at least 3 characters."
      );
      return;
    }

    if (!user) {
      setError("Please log in first.");
      return;
    }

    setCreating(true);
    setError("");

    let createdGroup = null;
    let lastError = null;

    // Generate a unique join code.
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateJoinCode();

      const {
        data,
        error: createError,
      } = await supabase
        .from("groups")
        .insert({
          name,
          host_id: user.id,
          join_code: code,
        })
        .select()
        .single();

      if (!createError) {
        createdGroup = data;
        break;
      }

      lastError = createError;
    }

    if (!createdGroup) {
      console.error(lastError);

      setError(
        lastError?.message ||
          "Unable to create the group."
      );

      setCreating(false);
      return;
    }

    // Add host as a member.
    const {
      error: memberError,
    } = await supabase
      .from("group_members")
      .insert({
        group_id: createdGroup.id,
        user_id: user.id,
      });

    if (memberError) {
      console.error(
        "Host membership error:",
        memberError
      );

      setError(
        "Group was created, but adding you as a member failed."
      );

      setCreating(false);
      return;
    }

    // Add new group to history immediately.
    setHostedGroups((previous) => [
      createdGroup,
      ...previous,
    ]);

    setGroupName("");

    // Open the new group's dashboard.
    navigate(
      `/group/${createdGroup.id}`
    );

    setCreating(false);
  };

  // ----------------------------------------
  // JOIN GROUP
  // ----------------------------------------

  const joinGroup = async () => {
    const code = joinCode.trim();

    if (!code) {
      setError("Please enter a group code.");
      return;
    }

    if (code.length !== 6) {
      setError(
        "Group code must be 6 characters."
      );
      return;
    }

    if (!user) {
      setError("Please log in first.");
      return;
    }

    setJoining(true);
    setError("");

    const {
      data,
      error: joinError,
    } = await supabase.rpc(
      "join_group_by_code",
      {
        p_join_code: code,
      }
    );

    if (joinError) {
      console.error(joinError);

      setError(
        joinError.message ||
          "Unable to join this group."
      );

      setJoining(false);
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "No group was found with that code."
      );

      setJoining(false);
      return;
    }

    setJoinCode("");

    // Open the joined group's dashboard.
    navigate(
      `/group/${data[0].id}`
    );

    setJoining(false);
  };

  // ----------------------------------------
  // COPY GROUP CODE
  // ----------------------------------------

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Join code copied.");
    } catch (error) {
      console.error(error);
      alert(`Join code: ${code}`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="host-page">

          {/* PAGE HEADING */}

          <div className="page-heading">
            <span className="eyebrow">
              Collaborative groups
            </span>

            <h1>
              Host a space for ideas.
            </h1>

            <p>
              Create a private group where students
              can share ideas with the people they
              choose.
            </p>
          </div>


          {/* ERROR */}

          {error && (
            <div className="error-state host-error">

              <p>{error}</p>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  setError("")
                }
              >
                Dismiss
              </button>

            </div>
          )}


          {/* CREATE + JOIN */}

          <div className="host-grid">

            {/* CREATE GROUP */}

            <section className="host-card">

              <span className="host-icon">
                +
              </span>

              <h2>
                Create a group
              </h2>

              <p>
                Start a new private space and invite
                students using a six-character code.
              </p>

              <label>
                Group name
              </label>

              <input
                type="text"
                placeholder="e.g. Innovation Hub"
                value={groupName}
                onChange={(event) =>
                  setGroupName(
                    event.target.value
                  )
                }
                maxLength={80}
              />

              <button
                className="btn btn-primary host-button"
                onClick={createGroup}
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Group →"}
              </button>

            </section>


            {/* JOIN GROUP */}

            <section className="host-card">

              <span className="host-icon">
                ↗
              </span>

              <h2>
                Join a group
              </h2>

              <p>
                Enter the code shared by a host to
                join their idea-sharing space.
              </p>

              <label>
                Group code
              </label>

              <input
                type="text"
                placeholder="e.g. A7K92P"
                value={joinCode}
                onChange={(event) =>
                  setJoinCode(
                    event.target.value
                      .toUpperCase()
                      .replace(
                        /[^A-Z0-9]/g,
                        ""
                      )
                  )
                }
                maxLength={6}
              />

              <button
                className="btn btn-secondary host-button"
                onClick={joinGroup}
                disabled={joining}
              >
                {joining
                  ? "Joining..."
                  : "Join Group →"}
              </button>

            </section>

          </div>


          {/* ====================================
              HOSTED GROUP HISTORY
          ==================================== */}

          <section className="hosted-history">

            <div className="section-heading-row">

              <div>

                <span className="eyebrow">
                  Your history
                </span>

                <h2>
                  Your hosted groups
                </h2>

              </div>

            </div>


            {loadingGroups ? (

              <div className="empty-state">
                <div className="spinner" />

                <p>
                  Loading your groups...
                </p>
              </div>

            ) : hostedGroups.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No hosted groups yet.
                </h3>

                <p>
                  Groups you create will appear
                  here so you can quickly return
                  to their dashboards.
                </p>

              </div>

            ) : (

              <div className="hosted-group-list">

                {hostedGroups.map(
                  (group) => (

                    <Link
                      key={group.id}
                      to={`/group/${group.id}`}
                      className="hosted-group-card"
                    >

                      <div className="hosted-group-main">

                        <div className="hosted-group-icon">
                          ✦
                        </div>

                        <div>

                          <h3>
                            {group.name}
                          </h3>

                          <p>
                            Created{" "}
                            {new Date(
                              group.created_at
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>


                      <div className="hosted-group-right">

                        <div className="history-code">

                          <span>
                            Join code
                          </span>

                          <strong>
                            {group.join_code}
                          </strong>

                        </div>


                        <button
                          type="button"
                          className="history-copy"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            copyCode(
                              group.join_code
                            );
                          }}
                        >
                          Copy
                        </button>


                        <span className="history-arrow">
                          →
                        </span>

                      </div>

                    </Link>

                  )
                )}

              </div>

            )}

          </section>

        </div>
      </main>
    </>
  );
}