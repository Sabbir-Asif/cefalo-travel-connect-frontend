import { useEffect, useState } from 'react';
import { getAllBlogsAPI } from '../../utils/api/blog';
import type { Blog as BlogType } from '../../types/Blog';
import BlogCard from '../../components/blog/BlogCard';
import { FaPenNib } from "react-icons/fa";
import { useNavigate } from 'react-router';

const Blogs = () => {
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/create-blog');
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            const data = await getAllBlogsAPI();
            setBlogs(data);
        };
        fetchBlogs();
    }, []);

    return (
        <div className="p-6">
            <div className='flex items-center justify-between'>
                <h2 className="text-4xl text-center font-nunito font-black mb-16">Explore Blogs</h2>
                <button
                    className='bg-black text-white p-2 font-pacifico rounded-full'
                    onClick={handleClick}
                >
                    <div className='flex items-center gap-2'>
                        <FaPenNib />
                        Write a Blog
                    </div>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default Blogs;
