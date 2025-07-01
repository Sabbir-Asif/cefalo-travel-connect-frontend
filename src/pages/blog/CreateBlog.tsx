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
      <div className="">
        <CreateBlogForm onSuccess={handleSuccess} onError={handleError} />
      </div>
  );
};

export default CreateBlogPage;
