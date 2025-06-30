import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";

const Navbar: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    TravelConnect
                </Link>
            </div>
            <div className="flex-none">
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
