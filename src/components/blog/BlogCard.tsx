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
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src={blog.cover_image || ""}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {blog.title}
                    <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                <div className="flex justify-between items-center">
                    <button
                        className="btn btn-primary"
                        onClick={handleClick}
                    >Details
                    </button>
                    <div className="card-actions">
                        {
                            blog.tags && blog.tags.map(tag =>
                                <div className="badge badge-outline">{tag}</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
