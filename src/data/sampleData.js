// Sample product data used as a fallback when Firestore has no products yet.
// In production, products are managed via the Admin Dashboard (CRUD -> Firestore "products" collection).
export const sampleProducts = [
  {
    id: "sample-1",
    title: "Elden Ring",
    platform: "PS5",
    genre: "Action RPG",
    price: 35,
    stock: 12,
    condition: "New",
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80",
    description:
      "Explore the Lands Between in this critically acclaimed open-world action RPG.",
  },
  {
    id: "sample-2",
    title: "God of War: Ragnarok",
    platform: "PS5",
    genre: "Action Adventure",
    price: 40,
    stock: 8,
    condition: "New",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    description: "Join Kratos and Atreus on a mythic journey through the Norse realms.",
  },
  {
    id: "sample-3",
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo Switch",
    genre: "Adventure",
    price: 45,
    stock: 15,
    condition: "New",
    image:
      "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80",
    description: "Soar above and dive below Hyrule in this expansive Zelda adventure.",
  },
  {
    id: "sample-4",
    title: "Forza Horizon 5",
    platform: "Xbox Series X",
    genre: "Racing",
    price: 30,
    stock: 10,
    condition: "New",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    description: "Race through the vibrant, ever-evolving open world of Mexico.",
  },
  {
    id: "sample-5",
    title: "FIFA 24",
    platform: "PS5",
    genre: "Sports",
    price: 28,
    stock: 20,
    condition: "Used - Like New",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&q=80",
    description: "The world's game, featuring HyperMotionV technology.",
  },
  {
    id: "sample-6",
    title: "Mario Kart 8 Deluxe",
    platform: "Nintendo Switch",
    genre: "Racing",
    price: 32,
    stock: 18,
    condition: "New",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80",
    description: "The definitive Mario Kart experience, now with more content.",
  },
];
