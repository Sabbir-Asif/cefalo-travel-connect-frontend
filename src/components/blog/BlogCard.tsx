import React, { useState } from 'react';
import { useNavigate } from "react-router";
import type { BlogResponse } from "../../types/Blog";
import CreateWishlistModalFromBlog from '../wishlist/CreateWishlistModalFromBlog';
import { FaRegBookmark } from "react-icons/fa6";
import { HiViewGridAdd } from "react-icons/hi";
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
    blog: BlogResponse;
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
            <div className="card bg-white max-w-2xl shadow-sm border border-gray-200 rounded-lg font-nunito overflow-hidden">
                <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center gap-3'>
                        <div className='h-12 w-12 rounded-full'>
                            {blog.user?.displayPicture &&
                                <img src={blog.user.displayPicture} alt="image"
                                    className='rounded-full h-12 w-12 object-cover'
                                />
                            }
                        </div>
                        <div>
                            <p className='text-lg font-extrabold font-nunito text-gray-900 hover:text-blue-600'>{blog.user?.name}</p>
                            <p className='text-sm text-gray-500'>{formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-3">
                    <h2 className="text-xl font-nunito font-semibold leading-relaxed mb-3 cursor-pointer hover:underline">
                        {blog.title}
                    </h2>

                    {blog.tags && (
                        <div className='flex flex-wrap gap-1 mb-1'>
                            {blog.tags.map((tag, index) => (
                                <span key={index} className='text-blue-600 font-semibold hover:underline cursor-pointer'>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {blog.locationName && (
                        <p className="text-gray-600 mb-1">{blog.locationName}</p>
                    )}
                </div>

                <figure className='w-full'>
                    <img
                        src={blog.cover_image || ""}
                        alt={blog.title}
                        className='w-full h-80 object-cover cursor-pointer hover:opacity-95'
                        onClick={handleDetailsClick}
                    />
                </figure>

                <div className="px-4 py-2">
                    <div className="flex items-center justify-between">

                        <button
                            className="btn btn-ghost flex items-center gap-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleDetailsClick}
                        >
                            < HiViewGridAdd className='text-xl' />
                            <span className="text-lg font-semibold">Details</span>
                        </button>

                        <button
                            className='btn btn-ghost flex items-center gap-2 text-gray-600 hover:bg-gray-100'
                            onClick={handleWishlistClick}
                        >
                            <FaRegBookmark className="text-xl" />
                            <span className="text-lg font-semibold">Save</span>
                        </button>
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