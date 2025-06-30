import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UserProfile from "../pages/UserProfile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import CreateBlogPage from "../pages/CreateBlog";
import Blogs from "../components/blog/Blogs";
import BlogPage from "../components/blog/BlogPage";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/',
        element: <Home />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Blogs />
                    },
                    {
                        path: 'profile',
                        element: <UserProfile />
                    },
                    {
                        path: 'create-blog',
                        element: <CreateBlogPage />
                    },
                    {
                        path: 'blogs/:blogId',
                        element: <BlogPage />
                    }
                ]
            }
        ]
    }
]);

export default router;