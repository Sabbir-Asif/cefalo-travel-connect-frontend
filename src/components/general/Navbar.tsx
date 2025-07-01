import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";
import { MdTravelExplore } from "react-icons/md";

const Navbar: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <div className="navbar justify-between">
            <div className="">
                <Link to="/" className="btn btn-ghost text-2xl font-medium font-pacifico">
                    <MdTravelExplore className="bg-g-primary text-4xl rounded-full" />
                    Ghuro
                </Link>
            </div>
            <div className="flex gap-8">
                <div className="">
                    {
                        isAuthenticated &&
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `hover:bg-gray-300 p-2 font-nunito text-xl font-bold ${isActive
                                    ? "border-b-1"
                                    : ""
                                }`
                            }
                        >
                            Home
                        </NavLink>
                    }
                </div>
                <div className="">
                    {
                        isAuthenticated &&
                        <NavLink
                            to="/create-blog"
                            className={({ isActive }) =>
                                `hover:bg-gray-300 p-2 font-nunito text-xl font-bold ${isActive
                                    ? "border-b-1"
                                    : ""
                                }`
                            }
                        >
                            Create Blog
                        </NavLink>
                    }
                </div>
                <div className="">
                    {
                        isAuthenticated &&
                        <NavLink
                            to={`/dashboard/${user?.id}`}
                            className={({ isActive }) =>
                                `hover:bg-gray-300 p-2 font-nunito text-xl font-bold ${isActive
                                    ? "border-b-1"
                                    : ""
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                    }
                </div>
                <div className="">
                    {
                        user?.role === 'ADMIN' &&
                        <NavLink
                            to={`/admin-dashboard`}
                            className={({ isActive }) =>
                                `hover:bg-gray-300 p-2 font-nunito text-xl font-bold ${isActive
                                    ? "border-b-1"
                                    : ""
                                }`
                            }
                        >
                            Admin Dashboard
                        </NavLink>
                    }
                </div>
            </div>
            <div className="justify-end">
                {isAuthenticated ? (
                    <button onClick={handleProfileClick} className="btn bg-black rounded-full text-white font-nunito font-bold text-md">
                        Profile
                    </button>
                ) : (
                    <Link to="/login" className="btn bg-black rounded-full text-white font-nunito font-bold text-md">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;