import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import IdeaForm from "../components/IdeaForm";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function CreateIdea() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [initialData, setInitialData] =
    useState(null);

  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const loadIdea = async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        alert(error.message);
        navigate("/ideas");
        return;
      }

      setInitialData(data);
      setLoading(false);
    };

    loadIdea();
  }, [id, user, navigate]);

  const handleSubmit = async (idea) => {
    if (!user) {
      throw new Error(
        "You must be logged in."
      );
    }

    setSubmitting(true);

    if (id) {
      const { error } = await supabase
        .from("ideas")
        .update({
          title: idea.title,
          description: idea.description,
          category: idea.category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      setSubmitting(false);

      if (error) {
        throw new Error(error.message);
      }

      navigate(`/ideas/${id}`);
      return;
    }

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

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-loading">
          <div className="spinner" />
          <p>Loading idea...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="form-wrap">
          <IdeaForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </main>
    </>
  );
}