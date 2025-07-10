import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getBlogsByUserId } from '../../../utils/api/blog';
import type { Blog } from '../../../types/Blog';
import BlogCard from '../../blog/BlogCard';

const BlogList: React.FC = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const blogData = await getBlogsByUserId(user.id);
            setBlogs(blogData);
        };

        fetchData();
    }, [user?.id]);

    if (blogs.length === 0) {
        return <div>
            No Blogs Found
        </div>
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog: Blog) => (
                    <BlogCard
                        key={blog.id}
                        blog={blog}
                    />
                ))}
            </div>
        </div>
    );
};

export default BlogList;