import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { resetPasswordAPI } from "../../utils/api/auth";

const ResetPasswordConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPasswordAPI(token!, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const message = (err as Error).message || "Failed to reset password.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return <p className="text-center mt-10 text-green-600">Password reset successful! Redirecting to login...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Set a New Password</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;
