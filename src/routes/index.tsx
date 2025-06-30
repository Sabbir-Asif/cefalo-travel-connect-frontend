import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UserProfile from "../pages/UserProfile";
import ProtectedRoute from "../components/auth/ProtectedRoute";

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
                        path: 'profile',
                        element: <UserProfile />
                    },
                ]
            }
        ]
    }
]);

export default router;