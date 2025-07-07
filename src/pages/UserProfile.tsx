import React from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";
import { User, Mail, Phone, Shield, Calendar, Edit3, LogOut, Check } from "lucide-react";

const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-500 text-white';
            case 'USER': return 'bg-blue-500 text-white';
            case 'MODERATOR': return 'bg-yellow-400 text-black';
            default: return 'bg-gray-300 text-black';
        }
    };

    return (
        <div className="p-6 flex items-center justify-center bg-white">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200 shadow-lg">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-md transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src={user.displayPicture!}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {user.is_verified && (
                                <div className="absolute -bottom-2 -right-2 bg-green-600 rounded-full p-2 border-4 border-white shadow-lg">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                        <span className={`${getRoleColor(user.role)} px-3 py-1 rounded-full text-sm font-medium`}>
                                            {user.role}
                                        </span>
                                        {user.is_verified && (
                                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 border border-gray-300"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {user.bio && (
                                <p className="text-gray-700 text-lg mb-4">{user.bio}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-700" />
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <Phone className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-gray-500 text-sm">Phone</p>
                                    <p className="text-gray-900 font-medium">{user.phone_number || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <Shield className="w-5 h-5 text-purple-500" />
                                <div>
                                    <p className="text-gray-500 text-sm">Role</p>
                                    <p className="text-gray-900 font-medium">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-700" />
                            Account Details
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-sm">Member Since</p>
                                <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-sm">Last Updated</p>
                                <p className="text-gray-900 font-medium">{formatDate(user.updatedAt)}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-sm">Verification Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                    <p className="text-gray-900 font-medium">{user.is_verified ? 'Verified' : 'Not Verified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
