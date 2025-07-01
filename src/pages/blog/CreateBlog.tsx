import React from "react";
import { useNavigate } from "react-router";
import { CreateBlogForm } from "../../components/blog/CreateBlogForm";
import type { Blog } from "../../types/Blog";
import { showToast } from "../../components/general/Toast";

const CreateBlogPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (blog: Blog) => {
    console.log("Blog created successfully:", blog);
    showToast("Blog created successfully!", "success");
    navigate(`/blogs/${blog.id}`);
  };

  const handleError = (error: string) => {
    console.error("Failed to create blog:", error);
    showToast(error || "Failed to create blog", "error");
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <button onClick={() => navigate("/")} className="link link-hover">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/blogs")} className="link link-hover">
                Blogs
              </button>
            </li>
            <li>Create Blog</li>
          </ul>
        </div>

        <CreateBlogForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
};

export default CreateBlogPage;
