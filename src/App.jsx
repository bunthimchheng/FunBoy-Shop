import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import Orders from "./pages/admin/Orders";
import Reviews from "./pages/admin/Reviews";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public / informational pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin dashboard (protected, admin-only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute adminOnly>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute adminOnly>
                <Reviews />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="mb-2 text-4xl font-extrabold text-brand-900">404</h1>
      <p className="text-gray-600">Page not found.</p>
    </div>
  );
}
