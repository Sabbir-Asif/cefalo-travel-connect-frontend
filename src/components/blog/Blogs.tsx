import { useEffect, useState } from 'react';
import { getAllBlogsAPI } from '../../utils/api/blog';
import type { Blog as BlogType } from '../../types/Blog';
import BlogCard from './BlogCard';

const Blogs = () => {
    const [blogs, setBlogs] = useState<BlogType[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const data = await getAllBlogsAPI();
            setBlogs(data);
        };
        fetchBlogs();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Blog Page</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default Blogs;
