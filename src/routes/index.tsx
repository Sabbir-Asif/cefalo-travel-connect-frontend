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
import LandingPage from "../pages/LandingPage";
import TravelPlaces from "../pages/travel-place/TravelPlaces";
import TravelPlacePage from "../components/travel-place/TravelPlacePage";
import CreateTravelPageFormComponent from "../components/travel-place/CreateTravelPlaceForm";
import Wishlists from "../pages/wishlist/Wishlists";
import WishlistPage from "../components/wishlist/WishlistPage";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import BlogList from "../components/dashboard/user-dashboard/BlogList";
import TravelPlanList from "../components/dashboard/user-dashboard/TravelPlanList";
import WishlistList from "../components/dashboard/user-dashboard/WishlistList";
import TravelPlanPage from "../components/travel-plan/TravelPlanPage";

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
                    },
                    {
                        path: 'wishlists',
                        element: <Wishlists />
                    },
                    {
                        path: '/wishlists/:wishlistId',
                        element: <WishlistPage />
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: 'dashboard/:userId',
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <BlogList />
                    },
                    {
                        path: 'blogs',
                        element: <BlogList />
                    },
                    {
                        path: 'travel-plans',
                        element: <TravelPlanList />
                    },
                    {
                        path: 'wishlists',
                        element: <WishlistList />
                    },
                    {
                        path: 'travel-plans/:travelPlanId',
                        element: <TravelPlanPage />
                    },
                    {
                        element: <AdminRoute />,
                        children: [
                            {
                                path: 'admin',
                                element: <AdminDashboard />
                            }
                        ]
                    },
                ]
            },
        ]
    }
]);

export default router;