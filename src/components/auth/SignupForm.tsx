import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { Link } from "react-router";

const SignupForm: React.FC = () => {
    const { signup } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await signup(form.name, form.email, form.phone_number, form.password);
            setSuccess(true);
        } catch (err) {
            setError("Signup failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-white/70">Sign up to get started</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-red-200 text-sm">{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                        <span className="text-green-200 text-sm">Signup successful! Please log in.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-white/90">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-white/90">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone_number" className="block text-sm font-medium text-white/90">
                            Phone Number
                        </label>
                        <input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            placeholder="Enter your phone number"
                            value={form.phone_number}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="tel"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-white/90">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${loading
                            ? "bg-blue-500/50 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl active:transform active:scale-95"
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Signing up...</span>
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>
                <div className="mt-6 text-center text-white/70 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-300 hover:text-blue-200 transition-colors duration-200 hover:underline"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
