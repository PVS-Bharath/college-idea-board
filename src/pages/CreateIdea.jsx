import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import IdeaForm from "../components/IdeaForm";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function CreateIdea() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (idea) => {
    if (!user) {
      throw new Error("You must be logged in to create an idea.");
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("ideas")
      .insert({
        title: idea.title,
        description: idea.description,
        category: idea.category,
        user_id: user.id,
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      throw new Error(error.message);
    }

    navigate(`/ideas/${data.id}`);
  };

  return (
    <>
      <Navbar />

      <main className="page-container narrow">
        <div className="page-header">
          <span className="hero-label">NEW IDEA</span>

          <h1>Share your idea</h1>

          <p>
            Give your idea a clear description so other students
            can understand it.
          </p>
        </div>

        <IdeaForm
          onSubmit={handleCreate}
          submitting={submitting}
        />
      </main>
    </>
  );
}