import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 bg-brand-900 text-white shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="rounded bg-brand-500 px-2 py-1 text-sm">×͜×</span>
          FunBoy Shop
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-brand-100 ${
                  isActive ? "text-brand-100 underline underline-offset-4" : "text-white/90"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart" className="relative flex items-center gap-1 hover:text-brand-100" aria-label="Cart">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium hover:bg-brand-700"
            >
              Admin Dashboard
            </Link>
          )}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium hover:bg-brand-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 bg-brand-900 px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-sm hover:bg-white/10"
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/cart" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-white/10">
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-white/10">
              Admin Dashboard
            </Link>
          )}
          {currentUser ? (
            <button onClick={handleLogout} className="rounded px-2 py-2 text-left text-sm hover:bg-white/10">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-white/10">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-white/10">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
