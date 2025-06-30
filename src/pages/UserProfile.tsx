import React from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";

const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-base-200 rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Profile</h2>
            </div>

            <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone_number || "N/A"}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
            <button className="btn btn-error btn-sm mt-6" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default UserProfile;
