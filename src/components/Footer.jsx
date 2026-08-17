export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-bold text-white">Game Discs Shop</h3>
          <p className="text-sm">
            Your trusted store for genuine, physical game discs across PlayStation,
            Xbox, and Nintendo Switch.
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/products" className="hover:text-white">Shop</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: funboyshop@gmail.com</li>
            <li>Phone: +855 71 345 678</li>
            <li>Phnom Penh, Cambodia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Game Discs Shop. All rights reserved.
      </div>
    </footer>
  );
}
