import React, { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import type { CreateBlog } from "../types/Blog";
import { uploadImageToCloudinary } from "../utils/cloudinary";

const CreateBlogPage: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      const imageMarkdown = `![uploaded-image](${url})`;
      setContent((prev) => prev + "\n" + imageMarkdown);
    } catch (err) {
      alert("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleToolbarClick = (symbol: string, wrapper = false) => {
    if (!editorRef.current) return;
    const textarea = editorRef.current.querySelector("textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const insertText = wrapper ? `${symbol}${selected}${symbol}` : `${symbol} ${selected}`;
    const newText = content.substring(0, start) + insertText + content.substring(end);
    setContent(newText);
  };

  const handleSubmit = () => {
    const payload: CreateBlog = {
      title,
      locationName,
      location_points: {
        lat: 0,
        long: 0,
      },
      description,
      tags: [],
      images: [],
      videos: [],
    };
    console.log({ ...payload, content });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <h1 className="text-3xl font-bold mb-4">Create New Blog</h1>

      <input
        type="text"
        placeholder="Title"
        className="input input-bordered w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location Name"
        className="input input-bordered w-full mb-4"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="textarea textarea-bordered w-full mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex items-center gap-2 mb-2">
        <button className="btn btn-sm" onClick={() => handleToolbarClick("**", true)}>Bold</button>
        <button className="btn btn-sm" onClick={() => handleToolbarClick("*", true)}>Italic</button>
        <button className="btn btn-sm" onClick={() => handleToolbarClick("#")}>Heading</button>
        <button className="btn btn-sm" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? "Edit" : "Preview"}
        </button>
        <label className="btn btn-sm">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />
        </label>
      </div>

      <div ref={editorRef}>
        {previewMode ? (
          <MDEditor.Markdown source={content} className="bg-base-100 p-4 rounded" />
        ) : (
          <MDEditor value={content} onChange={(val = "") => setContent(val)} height={400} />
        )}
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSubmit} disabled={uploading}>
        {uploading ? "Uploading..." : "Submit Blog"}
      </button>
    </div>
  );
};

export default CreateBlogPage;
