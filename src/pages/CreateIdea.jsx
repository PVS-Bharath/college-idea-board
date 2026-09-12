import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import IdeaForm from "../components/IdeaForm";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function CreateIdea() {
  const { id } = useParams();
  const [searchParams] =
    useSearchParams();

  const { user } = useAuth();
  const navigate = useNavigate();

  const groupId =
    searchParams.get("group");

  const isEditing = Boolean(id);

  const [initialData, setInitialData] =
    useState(null);

  const [group, setGroup] =
    useState(null);

  const [loading, setLoading] =
    useState(isEditing);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  // ========================================
  // LOAD EDIT DATA
  // ========================================

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError("");

        // -----------------------------
        // EDITING
        // -----------------------------

        if (isEditing) {
          const {
            data,
            error: ideaError,
          } = await supabase
            .from("ideas")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

          if (ideaError) {
            throw new Error(
              ideaError.message
            );
          }

          setInitialData(data);

          // Load associated group
          if (data.group_id) {
            const {
              data: groupData,
              error: groupError,
            } = await supabase
              .from("groups")
              .select(
                "id, name, join_code"
              )
              .eq(
                "id",
                data.group_id
              )
              .maybeSingle();

            if (!groupError) {
              setGroup(groupData);
            }
          }

          setLoading(false);
          return;
        }


        // -----------------------------
        // CREATING
        // -----------------------------

        if (groupId) {
          const {
            data: groupData,
            error: groupError,
          } = await supabase
            .from("groups")
            .select(
              "id, name, join_code"
            )
            .eq("id", groupId)
            .maybeSingle();

          if (groupError) {
            throw new Error(
              groupError.message
            );
          }

          if (!groupData) {
            throw new Error(
              "The selected group could not be found."
            );
          }

          setGroup(groupData);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);

        setError(
          err?.message ||
            "Unable to load the idea."
        );

        setLoading(false);
      }
    };

    loadData();
  }, [
    user,
    id,
    groupId,
    isEditing,
  ]);


  // ========================================
  // IMAGE UPLOAD
  // ========================================

  const uploadImage = async (
    imageFile
  ) => {
    if (!imageFile) {
      return null;
    }

    const fileExtension =
      imageFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${crypto.randomUUID()}.${fileExtension}`;

    const filePath =
      `${user.id}/${fileName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("idea-images")
      .upload(
        filePath,
        imageFile,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (uploadError) {
      throw new Error(
        `Image upload failed: ${uploadError.message}`
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("idea-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };


  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async ({
    title,
    category,
    description,
    visibility,
    imageFile,
    existingImageUrl,
    links,
  }) => {
    if (!user) {
      setError(
        "Please log in before publishing."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let imageUrl =
        existingImageUrl || null;


      // -----------------------------
      // UPLOAD NEW IMAGE
      // -----------------------------

      if (imageFile) {
        imageUrl =
          await uploadImage(imageFile);
      }


      // -----------------------------
      // CREATE
      // -----------------------------

      if (!isEditing) {
        if (!groupId) {
          throw new Error(
            "Please open Create Idea from a group."
          );
        }

        const {
          data,
          error: insertError,
        } = await supabase
          .from("ideas")
          .insert({
            user_id: user.id,
            group_id: groupId,
            title,
            description,
            category,
            visibility,
            image_url: imageUrl,
            links,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(
            insertError.message
          );
        }

        navigate(
          `/ideas/${data.id}`
        );

        return;
      }


      // -----------------------------
      // UPDATE
      // -----------------------------

      const {
        data,
        error: updateError,
      } = await supabase
        .from("ideas")
        .update({
          title,
          description,
          category,
          visibility,
          image_url: imageUrl,
          links,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      navigate(
        `/ideas/${data.id}`
      );
    } catch (err) {
      console.error(
        "Publish error:",
        err
      );

      setError(
        err?.message ||
          "Unable to publish the idea."
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-loading">
          <div className="spinner" />
          <p>
            Loading idea...
          </p>
        </div>
      </>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error && isEditing && !initialData) {
    return (
      <>
        <Navbar />

        <main className="container">

          <div className="detail-wrap">

            <div className="error-state">

              <h3>
                Unable to load idea
              </h3>

              <p>{error}</p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/ideas")
                }
              >
                Back to Ideas
              </button>

            </div>

          </div>

        </main>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="container">

        <div className="form-page">

          <div className="form-card">

            <div className="form-heading">

              <span className="eyebrow">
                {isEditing
                  ? "Edit your idea"
                  : group
                  ? `Sharing in ${group.name}`
                  : "Student ideas"}
              </span>

              <h1>
                {isEditing
                  ? "Update your idea"
                  : "Share your idea"}
              </h1>

              <p>
                {isEditing
                  ? "Update your idea and choose who can see it."
                  : "Give your idea a clear description so other students can understand it."}
              </p>

            </div>


            {/* GROUP INFO */}

            {!isEditing && group && (
              <div className="idea-group-context">

                <div className="idea-group-context-icon">
                  ✦
                </div>

                <div>

                  <span>
                    Publishing to
                  </span>

                  <strong>
                    {group.name}
                  </strong>

                </div>

              </div>
            )}


            {/* ERROR */}

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}


            <IdeaForm
              initialData={
                isEditing
                  ? initialData
                  : null
              }
              onSubmit={handleSubmit}
              submitting={submitting}
            />

          </div>

        </div>

      </main>
    </>
  );
}