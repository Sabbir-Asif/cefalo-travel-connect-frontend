import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserProfile from "../pages/UserProfile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import CreateBlogPage from "../pages/blog/CreateBlog";
import Blogs from "../pages/blog/Blogs";
import BlogPage from "../components/blog/BlogPage";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminRoute from "../components/auth/AdminRoute";
import UserDashboard from "../pages/dashboard/UserDashboard";
import LandingPage from "../pages/LandingPage";
import TravelPlaces from "../pages/travel-place/TravelPlaces";
import TravelPlacePage from "../components/travel-place/TravelPlacePage";
import CreateTravelPageFormComponent from "../components/travel-place/CreateTravelPlaceForm";

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
                index: true,
                element: <LandingPage />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'blogs',
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
                    },
                    {
                        path: '/dashboard/:userId',
                        element: <UserDashboard />
                    },
                    {
                        element: <AdminRoute />,
                        children: [
                            {
                                path: 'admin-dashboard',
                                element: <AdminDashboard />
                            }
                        ]
                    },
                    {
                        path: 'travel-places',
                        element: <TravelPlaces />
                    },
                    {
                        path: 'travel-places/:travelPlaceId',
                        element: <TravelPlacePage />
                    },
                    {
                        path: 'create-travel-place',
                        element: <CreateTravelPageFormComponent />
                    }
                ]
            }
        ]
    }
]);

export default router;