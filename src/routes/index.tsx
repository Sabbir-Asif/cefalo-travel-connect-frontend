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
import ErrorPage from "../pages/ErrorPage";
import RequestPage from "../components/travel-request/RequestPage";
import SentRequest from "../components/travel-request/SentRequest";
import RecievedRequest from "../components/travel-request/RecievedRequest";
import CreateTravelPlanModal from "../components/travel-plan/CreateTravelPlanModal";
import JourneyPage from "../components/travel-plan/JourneyPage";
import ResetPasswordConfirm from "../pages/auth/ResetPasswordConfirm";
import RequestPasswordReset from "../pages/auth/RequestPasswordReset";

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
        path: "/reset-password",
        element: <RequestPasswordReset />
    },
    {
        path: "/reset-password/confirm",
        element: <ResetPasswordConfirm />
    },
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
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
                        path: 'create-travel-plan',
                        element: <CreateTravelPlanModal />
                    },
                    {
                        path: 'wishlists',
                        element: <Wishlists />
                    },
                    {
                        path: '/wishlists/:wishlistId',
                        element: <WishlistPage />
                    },
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
                        path: 'requests',
                        element: <RequestPage />,
                        children: [
                            {
                                index: true,
                                element: <RecievedRequest />
                            },
                            {
                                path: 'sent',
                                element: <SentRequest />
                            },
                            {
                                path: 'recieved',
                                element: <RecievedRequest />
                            }
                        ]
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
            {
                path: 'travel-plans/:travelPlanId/journey',
                element: <JourneyPage />
            },
        ]
    }
]);

export default router;