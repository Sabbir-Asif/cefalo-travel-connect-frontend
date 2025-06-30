import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";


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
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-base-200 rounded-md shadow-md"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-4">
                    <span>Signup successful!</span>
                </div>
            )}

            <div className="form-control mb-4">
                <label className="label" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="input input-bordered"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-control mb-4">
                <label className="label" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="input input-bordered"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-control mb-4">
                <label className="label" htmlFor="phone_number">
                    Phone Number
                </label>
                <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    className="input input-bordered"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-control mb-6">
                <label className="label" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="input input-bordered"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
            >
                {loading ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
};

export default SignupForm;
