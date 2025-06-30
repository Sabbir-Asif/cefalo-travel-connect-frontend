import { useEffect, useState } from "react";
import { getBlogById } from "../../utils/api/blog";
import { useParams } from "react-router";
import type { Blog } from "../../types/Blog";
import type { Transport } from "../../types/Transport";
import type { Lodge } from "../../types/Lodge";
import type { Food } from "../../types/Food";
import type { BlogInsight } from "../../types/BlogInsight";

interface BlogDetailsResponse {
    blog: Blog;
    transports: Transport[];
    lodges: Lodge[];
    food: Food[];
    insights: BlogInsight[];
}

const BlogPage = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const [blogData, setBlogData] = useState<BlogDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (!blogId) return;
                const data: BlogDetailsResponse= await getBlogById(blogId);
                setBlogData(data);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!blogData) return <div className="p-4">Blog not found.</div>;

    const { blog, transports, lodges, food, insights } = blogData;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{blog.title}</h1>
            <p className="text-gray-600">{blog.locationName}</p>
            <p className="mt-2 text-lg">{blog.description}</p>

            <section>
                <h2 className="text-xl font-semibold mt-6">Transports</h2>
                {transports.length === 0 ? (
                    <p className="text-gray-500">No transport information available.</p>
                ) : (
                    <ul className="space-y-2">
                        {transports.map((transport) => (
                            <li key={transport.id} className="border p-4 rounded-md">
                                <p><strong>Type:</strong> {transport.type}</p>
                                <p><strong>Name:</strong> {transport.name}</p>
                                <p><strong>From:</strong> {transport.starting_location} → <strong>To:</strong> {transport.destination}</p>
                                <p><strong>Departure:</strong> {new Date(transport.departure_time!).toLocaleString()}</p>
                                <p><strong>Arrival:</strong> {new Date(transport.arrival_time!).toLocaleString()}</p>
                                <p><strong>Fare:</strong> ৳{transport.fare}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Lodges</h2>
                {lodges.length === 0 ? (
                    <p className="text-gray-500">No lodge information available.</p>
                ) : (
                    <ul className="space-y-2">
                        {lodges.map((lodge) => (
                            <li key={lodge.id} className="border p-4 rounded-md">
                                <p><strong>Name:</strong> {lodge.name}</p>
                                <p><strong>Location:</strong> {lodge.location_name}</p>
                                <p><strong>Price:</strong> ৳{lodge.price}</p>
                                {lodge.description && <p>{lodge.description}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Food</h2>
                {food.length === 0 ? (
                    <p className="text-gray-500">No food entries available.</p>
                ) : (
                    <ul className="space-y-2">
                        {food.map((item) => (
                            <li key={item.id} className="border p-4 rounded-md">
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Category:</strong> {item.category}</p>
                                <p><strong>Provider:</strong> {item.provider}</p>
                                <p><strong>Location:</strong> {item.location}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Insights</h2>
                {insights.length === 0 ? (
                    <p className="text-gray-500">No insights provided.</p>
                ) : (
                    <ul className="space-y-2">
                        {insights.map((insight) => (
                            <li key={insight.id} className="border p-4 rounded-md">
                                <p><strong>{insight.label}</strong></p>
                                <p>{insight.data}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default BlogPage;
