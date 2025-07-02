import React, { useState } from 'react';
import { useNavigate } from "react-router";
import type { Blog } from "../../types/Blog";
import CreateWishlistModalFromBlog from '../wishlist/CreateWishlistModalFromBlog';
import { FaRegBookmark } from "react-icons/fa6";

interface BlogCardProps {
    blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDetailsClick = () => {
        navigate(`/blogs/${blog.id}`);
    };

    const handleWishlistClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                    <img
                        src={blog.cover_image || ""}
                        alt={blog.title} />
                </figure>
                <div className="card-body">
                    <div className='flex justify-between'>
                        <h2 className="card-title">
                            {blog.title}
                        </h2>
                        
                        <button
                        className='text-lg hover:bg-g-primary'
                        onClick={handleWishlistClick}
                        >
                            <FaRegBookmark />
                        </button>
                    </div>
                    <p>{blog.locationName}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                className="btn btn-primary"
                                onClick={handleDetailsClick}
                            >
                                Details
                            </button>
                        </div>
                        <div className="card-actions">
                            {
                                blog.tags && blog.tags.map((tag, index) =>
                                    <div key={index} className="badge badge-outline">{tag}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <CreateWishlistModalFromBlog
                blog={blog}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default BlogCard;