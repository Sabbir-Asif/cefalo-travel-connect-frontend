import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";

const Navbar: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleCreateBlogClick = () => {
        navigate("/create-blog");
    };

    return (
        <div className="navbar bg-base-200 justify-between shadow-md">
            <div className="">
                <Link to="/" className="btn btn-ghost text-xl">
                    TravelConnect
                </Link>
            </div>
            <button onClick={handleCreateBlogClick} className="btn btn-ghost">
                Create Blog
            </button>
            <div className="">
                {
                    isAuthenticated &&
                    <div className="hover:bg-primary p-2 rounded-full">
                        <Link to={`/dashboard/${user?.id}`}>
                            Dashboard
                        </Link>
                    </div>
                }
            </div>
            <div className="">
                {
                    user?.role === 'ADMIN' &&
                    <div className="hover:bg-primary p-2 rounded-full">
                        <Link to='admin-dashboard'>
                            Admin Dashboard
                        </Link>
                    </div>
                }
            </div>
            <div className="justify-end">
                {isAuthenticated ? (
                    <button onClick={handleProfileClick} className="btn btn-primary">
                        Profile
                    </button>
                ) : (
                    <Link to="/login" className="btn btn-outline">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;