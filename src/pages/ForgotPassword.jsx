import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await resetPassword(email);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-extrabold text-brand-900">
        Reset Your Password
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          Enter your account email and we'll send you a link to reset your password.
        </p>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        {status === "sent" && (
          <p className="text-sm font-medium text-green-600">
            Reset link sent! Check your inbox.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-600">
            Couldn't send reset email. Check the address and try again.
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="text-center text-sm">
          Remembered your password?{" "}
          <Link to="/login" className="text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
