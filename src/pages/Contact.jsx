import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-extrabold text-brand-900">Contact Us</h1>
      <p className="mb-8 text-gray-600">
        Questions about an order or a title you're looking for? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
          <textarea
            required
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
        {status === "sent" && (
          <p className="text-sm font-medium text-green-600">Thanks! We'll get back to you soon.</p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}
