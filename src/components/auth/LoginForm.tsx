import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-base-200 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control mb-4">
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />
      </div>

      <div className="form-control mb-6">
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input input-bordered"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
