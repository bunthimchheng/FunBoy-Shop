import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-extrabold text-brand-900">
        Create Your Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
