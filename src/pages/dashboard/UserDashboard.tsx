// src/pages/UserDashboard.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getBlogsByUserId } from "../../utils/api/blog";
import { getTravelPlansByPlannerId } from "../../utils/api/travel-plan";
import BlogCard from "../../components/blog/BlogCard";
import TravelPlanCard from "../../components/travel-plan/TravelPlanCard";
import type { TravelPlan } from "../../types/TravelPlan";
import type { Blog } from "../../types/Blog";

const UserDashboard = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const blogData = await getBlogsByUserId(userId);
            console.log(blogData);
            const planData = await getTravelPlansByPlannerId(userId);
            setBlogs(blogData);
            setPlans(planData);
        };

        fetchData();
    }, [userId]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">User Dashboard</h2>

            <div>
                <h3 className="text-xl font-semibold mb-4">Blogs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogs.map((blog: Blog) => (
                        <BlogCard
                            key={blog.id}
                            blog={blog}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Travel Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan: TravelPlan) => (
                        <TravelPlanCard
                            key={plan.id}
                            travelPlan={plan}
                            onViewDetails={() => navigate(`/travel-plans/${plan.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
