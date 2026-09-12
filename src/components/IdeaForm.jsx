import { useEffect, useState } from "react";

const categories = [
  "Technology",
  "Campus",
  "Education",
  "Events",
  "Environment",
  "Other",
];

export default function IdeaForm({
  initialData = null,
  onSubmit,
  submitting = false,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("Technology");

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(
        initialData.description || ""
      );
      setCategory(
        initialData.category || "Technology"
      );
    }
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter an idea title.");
      return;
    }

    if (title.trim().length < 5) {
      setError(
        "Title must contain at least 5 characters."
      );
      return;
    }

    if (!description.trim()) {
      setError("Please describe your idea.");
      return;
    }

    if (description.trim().length < 20) {
      setError(
        "Description must contain at least 20 characters."
      );
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong."
      );
    }
  };

  return (
    <div className="form-card">
      <h1 className="form-title">
        {initialData
          ? "Edit your idea"
          : "Share your idea"}
      </h1>

      <p className="form-sub">
        Give your idea a clear description so other
        students can understand it.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">
            Idea Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="e.g. Smart campus navigation"
            value={title}
            maxLength={100}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            placeholder="Explain your idea..."
            value={description}
            maxLength={2000}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

          <div className="field-foot">
            <span>{description.length}</span>
            <span>characters</span>
          </div>
        </div>

        {error && (
          <div className="field-error">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              window.history.back()
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : initialData
              ? "Update Idea"
              : "Publish Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}