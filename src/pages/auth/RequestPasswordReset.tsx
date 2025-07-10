import React, { useState } from "react";
import { requestPasswordResetAPI } from "../../utils/api/auth";

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      setIsSubmitting(true);
      await requestPasswordResetAPI(email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err) {
      const msg = (err as Error).message || "Failed to send reset email.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot your password?</h2>
      <p className="mb-4 text-gray-600">
        Enter your email address and we’ll send you a link to reset your password.
      </p>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {message && <p className="text-green-600 mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
