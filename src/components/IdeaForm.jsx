import { useState } from "react";

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
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(
    initialData?.category || "Technology"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter an idea title.");
      return;
    }

    if (title.trim().length < 5) {
      setError("Title must contain at least 5 characters.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe your idea.");
      return;
    }

    if (description.trim().length < 20) {
      setError("Description must contain at least 20 characters.");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Idea title</label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Smart campus navigation"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Explain your idea..."
          rows={7}
          maxLength={2000}
        />

        <small>{description.length}/2000</small>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="primary-button"
        disabled={submitting}
      >
        {submitting
          ? "Saving..."
          : initialData
          ? "Update Idea"
          : "Publish Idea"}
      </button>
    </form>
  );
}