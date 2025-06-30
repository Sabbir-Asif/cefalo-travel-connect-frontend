import { useNavigate } from "react-router";
import type { Blog } from "../../types/Blog";

interface BlogCardProps {
    blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/blogs/${blog.id}`);
    }
    return (
        <div className="border rounded-xl shadow-md p-4 bg-white">
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-500 mb-1">{blog.locationName}</p>
            <p className="text-gray-700 mb-2">{blog.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-white">
                {blog.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-500 px-2 py-1 rounded">
                        #{tag}
                    </span>
                ))}
            </div>
            <button
                className="btn btn-primary"
                onClick={handleClick}
            >
                view details
            </button>
        </div>
    );
};

export default BlogCard;
