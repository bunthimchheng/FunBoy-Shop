# Game Discs Shop

A web-based e-commerce platform for selling physical game discs (PS5, Xbox, Nintendo
Switch, etc.), built with **React.js** (frontend) and **Firebase** (backend: Auth +
Firestore). Built to match the assignment scope:

- Public site: Home, About, Contact, Shop/Products (services)
- Shopping Cart & Checkout with **Cash on Delivery or ABA PAY/KHQR** payment,
  and automatic stock reduction per order
- Star ratings & reviews on each product, with admin replies
- Authentication: Register, Login, Forgot Password
- Admin Dashboard: live counts (products, users, orders, messages), product
  CRUD, and order management (view + update delivery status)
- Route protection so only admin users can reach the dashboard, and only
  logged-in users can check out

## Project Structure

```
game-discs-shop/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Routes
    ├── firebase.js         # Firebase init (Auth + Firestore)
    ├── context/
    │   ├── AuthContext.jsx # Login/Register/Logout/Reset password logic
    │   └── CartContext.jsx # Cart state, persisted to localStorage
    ├── components/
    │   ├── Navbar.jsx       # Includes cart icon with live item count
    │   ├── Footer.jsx
    │   ├── ProductCard.jsx  # Quick "Add" to cart button
    │   ├── ProductReviews.jsx # Review list, submit form, admin reply
    │   ├── StarRating.jsx    # Reusable star display / input
    │   └── ProtectedRoute.jsx
    ├── data/
    │   └── sampleData.js   # Fallback demo products (used until Firestore has data)
    └── pages/
        ├── Home.jsx
        ├── About.jsx
        ├── Contact.jsx
        ├── Products.jsx        # Shop listing with search & platform filter
        ├── ProductDetail.jsx   # Quantity selector + add to cart
        ├── Cart.jsx             # View/update/remove cart items
        ├── Checkout.jsx         # Shipping address + place order (writes to "orders")
        ├── Login.jsx
        ├── Register.jsx
        ├── ForgotPassword.jsx
        └── admin/
            ├── Dashboard.jsx    # Counts: products, users, orders, messages
            ├── Orders.jsx       # View orders + update delivery status
            ├── ProductList.jsx  # Read + Delete
            └── ProductForm.jsx  # Create + Update
```

## 1. Setup

```bash
npm install
```

## 2. Create a Firebase Project

1. Go to https://console.firebase.google.com and create a new project.
2. Enable **Authentication** → Sign-in method → Email/Password.
3. Enable **Firestore Database** (start in test mode for development).
4. Go to Project Settings → General → "Your apps" → Add a Web App, and copy the config.
5. Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```

## 3. Run the app

```bash
npm run dev
```

Visit http://localhost:5173

## 4. Making a user an Admin

By default every registered user gets `role: "customer"` in the `users` collection
in Firestore. To grant admin access:

1. Register a normal account through the app.
2. In the Firebase Console → Firestore → `users` collection, find that user's
   document (by uid).
3. Change the `role` field from `"customer"` to `"admin"`.
4. Log out and back in — the Navbar will now show "Admin Dashboard", and
   `/admin` routes become accessible.

## 5. Firestore Collections

| Collection  | Description                                   |
|-------------|------------------------------------------------|
| `users`     | User profile + role (`admin` / `customer`)     |
| `products`  | Game discs (title, platform, genre, price, stock, condition, image, description) |
| `messages`  | Contact form submissions                       |
| `orders`    | Placed orders (items, total, address, paymentMethod, paymentStatus, status, linked userId) — created at checkout |
| `reviews`   | Product reviews (productId, userId, rating, comment, optional adminReply) |

## 6. Suggested Firestore Security Rules (for production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow create, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
      // Admins can edit any field. Any signed-in customer can update ONLY the
      // "stock" field — this is what lets checkout decrement stock without
      // giving customers permission to change price/title/etc.
      allow update: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin" ||
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(["stock"]));
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /messages/{messageId} {
      allow create: if true;
      allow read, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
      // Only admins can change order status (e.g. pending -> delivered).
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      // Only the original reviewer can edit their own rating/comment; only
      // admins can set the adminReply field. This simple rule allows either
      // to update — tighten with request.resource.data.diff() checks if needed.
      allow update: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

## 7. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder — deploy it to Firebase Hosting, Netlify,
Vercel, or GitHub Pages (see below).

## 7b. Deploying to GitHub Pages

GitHub Pages only serves static files, so this project uses `HashRouter`
(routes look like `.../#/products` instead of `.../products`) and a relative
Vite `base` — both already configured — so it works on Pages with zero
extra setup.

1. Push this project to a GitHub repository.
2. Install the deploy dependency (already listed in `package.json`, just run):
   ```bash
   npm install
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```
   This builds the app and pushes the `dist/` folder to a `gh-pages` branch.
4. On GitHub: repo → **Settings → Pages** → under "Build and deployment",
   set **Source** to "Deploy from a branch" and **Branch** to `gh-pages` /
   `(root)`. Save.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`
   after a minute or two.

**If you deployed before this fix and still see 404s or a blank page:**
your browser or GitHub's CDN may have cached the old broken build — hard
refresh (Ctrl/Cmd+Shift+R) or wait a few minutes, then try again.

## 8. Connecting real ABA PayWay (currently a demo flow)

The Checkout page has a working "ABA PAY / KHQR" option, but it's a **UI demo** —
clicking "Pay Now" marks the order paid immediately without actually charging
anyone. That's intentional: ABA PayWay requires signing every payment request
with your **merchant API secret**, and that secret must never sit in frontend
code (anyone could read it in the browser and forge payments). To go live:

1. Register as an ABA PayWay merchant and get your Merchant ID + API Key from
   ABA Bank.
2. Create a **Firebase Cloud Function** (or any small backend) that:
   - Receives the order total from the frontend.
   - Builds the ABA PayWay request and signs it with `HMAC-SHA512` using your
     API secret (see ABA PayWay's developer docs for the exact field order).
   - Returns the signed payment form/QR data to the frontend, or redirects
     the user to ABA's hosted checkout page.
3. Replace the placeholder QR block and `handleConfirmAbaPayment` in
   `src/pages/Checkout.jsx` with a call to that Cloud Function.
4. Set up ABA's **webhook/callback** to notify your backend when payment
   actually succeeds, and have that backend update the order's
   `paymentStatus` field in Firestore to `"paid"` — don't trust the frontend
   to mark itself as paid in production.

## 9. Firestore index for Reviews

The review list queries by `productId` and orders by `createdAt`, which
needs a composite index. The first time you load a product page in
development, Firestore will show an error in the browser console with a
direct link to auto-create that index — click it once and reviews will
load normally after that.

## Notes

- Tailwind CSS is loaded via CDN in `index.html` for simplicity — no extra
  build configuration required.
- If Firestore is empty or not yet configured, the Home and Shop pages
  automatically fall back to sample demo data (`src/data/sampleData.js`) so
  the UI is fully browsable out of the box.
- This project intentionally covers the **"In case of website"** scope from
  the assignment: informational pages (Home/About/Contact/Services), an
  Admin Dashboard, Authentication, and CRUD on products.
- The cart is stored in the browser's `localStorage`, so it survives page
  refreshes but is per-device/per-browser. Placing an order requires being
  logged in, and writes a document to the `orders` collection in Firestore.
