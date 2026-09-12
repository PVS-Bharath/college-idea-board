import { useEffect, useState } from "react";

export default function IdeaForm({
  initialData,
  onSubmit,
  submitting = false,
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("Technology");
  const [description, setDescription] =
    useState("");

  const [visibility, setVisibility] =
    useState("public");

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [links, setLinks] = useState([""]);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");

    setCategory(
      initialData.category || "Technology"
    );

    setDescription(
      initialData.description || ""
    );

    setVisibility(
      initialData.visibility || "public"
    );

    setImagePreview(
      initialData.image_url || ""
    );

    if (
      Array.isArray(initialData.links) &&
      initialData.links.length > 0
    ) {
      setLinks(initialData.links);
    } else {
      setLinks([""]);
    }
  }, [initialData]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");

    const input =
      document.getElementById(
        "idea-image-input"
      );

    if (input) {
      input.value = "";
    }
  };

  const addLink = () => {
    setLinks((previous) => [
      ...previous,
      "",
    ]);
  };

  const updateLink = (index, value) => {
    setLinks((previous) =>
      previous.map((link, linkIndex) =>
        linkIndex === index
          ? value
          : link
      )
    );
  };

  const removeLink = (index) => {
    setLinks((previous) => {
      const updated = previous.filter(
        (_, linkIndex) =>
          linkIndex !== index
      );

      return updated.length > 0
        ? updated
        : [""];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanTitle = title.trim();
    const cleanDescription =
      description.trim();

    const cleanLinks = links
      .map((link) => link.trim())
      .filter(Boolean);

    if (cleanTitle.length < 5) {
      setError(
        "Idea title must be at least 5 characters."
      );
      return;
    }

    if (cleanDescription.length < 20) {
      setError(
        "Description must be at least 20 characters."
      );
      return;
    }

    for (const link of cleanLinks) {
      try {
        const parsed = new URL(link);

        if (
          parsed.protocol !== "http:" &&
          parsed.protocol !== "https:"
        ) {
          throw new Error();
        }
      } catch {
        setError(
          `Invalid link: ${link}`
        );
        return;
      }
    }

    await onSubmit({
      title: cleanTitle,
      category,
      description: cleanDescription,
      visibility,
      imageFile,
      existingImageUrl:
        initialData?.image_url || "",
      links: cleanLinks,
    });
  };

  return (
    <form
      className="idea-form"
      onSubmit={handleSubmit}
    >

      {/* TITLE */}

      <div className="form-field">

        <label htmlFor="idea-title">
          Idea Title
        </label>

        <input
          id="idea-title"
          type="text"
          placeholder="e.g. Smart campus navigation"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          maxLength={120}
          disabled={submitting}
        />

      </div>


      {/* CATEGORY */}

      <div className="form-field">

        <label htmlFor="idea-category">
          Category
        </label>

        <select
          id="idea-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          disabled={submitting}
        >
          <option value="Technology">
            Technology
          </option>

          <option value="Campus">
            Campus
          </option>

          <option value="Education">
            Education
          </option>

          <option value="Events">
            Events
          </option>

          <option value="Environment">
            Environment
          </option>

          <option value="Other">
            Other
          </option>
        </select>

      </div>


      {/* DESCRIPTION */}

      <div className="form-field">

        <label htmlFor="idea-description">
          Description
        </label>

        <textarea
          id="idea-description"
          placeholder="Explain your idea..."
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          maxLength={2000}
          disabled={submitting}
        />

        <div className="character-count">
          <span>
            {description.length}
          </span>

          <span>
            characters
          </span>
        </div>

      </div>


      {/* IMAGE */}

      <div className="form-field">

        <label>
          Image
        </label>

        {!imagePreview ? (

          <label
            htmlFor="idea-image-input"
            className="image-upload-box"
          >

            <div className="image-upload-icon">
              📷
            </div>

            <strong>
              Upload an image
            </strong>

            <span>
              JPG, PNG or WEBP · Max 5 MB
            </span>

          </label>

        ) : (

          <div className="image-preview-box">

            <img
              src={imagePreview}
              alt="Idea preview"
            />

            <button
              type="button"
              className="image-remove-button"
              onClick={removeImage}
              disabled={submitting}
            >
              Remove image
            </button>

          </div>

        )}

        <input
          id="idea-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={submitting}
          hidden
        />

      </div>


      {/* LINKS */}

      <div className="form-field">

        <label>
          Links
        </label>

        <div className="links-list">

          {links.map(
            (link, index) => (

              <div
                className="link-input-row"
                key={index}
              >

                <span className="link-prefix">
                  🔗
                </span>

                <input
                  type="url"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(event) =>
                    updateLink(
                      index,
                      event.target.value
                    )
                  }
                  disabled={submitting}
                />

                {links.length > 1 && (
                  <button
                    type="button"
                    className="link-remove"
                    onClick={() =>
                      removeLink(index)
                    }
                    disabled={submitting}
                    aria-label="Remove link"
                  >
                    ×
                  </button>
                )}

              </div>

            )
          )}

        </div>

        <button
          type="button"
          className="add-link-button"
          onClick={addLink}
          disabled={submitting}
        >
          + Add another link
        </button>

      </div>


      {/* VISIBILITY */}

      <div className="form-field">

        <label>
          Who can see this idea?
        </label>

        <div className="visibility-options">

          <label
            className={`visibility-option ${
              visibility === "public"
                ? "selected"
                : ""
            }`}
          >

            <input
              type="radio"
              name="visibility"
              value="public"
              checked={
                visibility === "public"
              }
              onChange={(event) =>
                setVisibility(
                  event.target.value
                )
              }
              disabled={submitting}
            />

            <div>
              <strong>
                Everyone in this group
              </strong>

              <span>
                Anyone in the group can view
                this idea.
              </span>
            </div>

          </label>


          <label
            className={`visibility-option ${
              visibility === "host_only"
                ? "selected"
                : ""
            }`}
          >

            <input
              type="radio"
              name="visibility"
              value="host_only"
              checked={
                visibility ===
                "host_only"
              }
              onChange={(event) =>
                setVisibility(
                  event.target.value
                )
              }
              disabled={submitting}
            />

            <div>
              <strong>
                Only the host
              </strong>

              <span>
                Keep this idea private from
                other group members.
              </span>
            </div>

          </label>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}


      {/* ACTIONS */}

      <div className="form-actions">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            window.history.back()
          }
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting
            ? "Publishing..."
            : initialData
            ? "Update Idea"
            : "Publish Idea"}
        </button>

      </div>

    </form>
  );
}