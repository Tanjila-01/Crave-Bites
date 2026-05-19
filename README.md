# 🍔 CraveBites

A Swiggy/Zomato-inspired full-stack food delivery platform built with **React (Vite frontend)** and **Django REST Framework (backend)**. Designed with a secure, modular, and responsive architecture, emphasizing clean UI/UX and robust data handling.

---

## 🚀 Project Overview

CraveBites is a feature-rich web application that simulates a complete food delivery lifecycle—from restaurant discovery and menu browsing to secure cart management, location-based filtering, and order tracking. It implements robust patterns such as HttpOnly JWT authentication, server-side cart validation, defensive rendering, and a reliable checkout flow to ensure a professional and bug-free user experience.

---

## ✨ Features

**Authentication & User Management**
- Secure JWT Authentication (HttpOnly cookies, no localStorage)
- Login/Register/Logout flows
- Support for both Email and Username login
- Comprehensive User Profile dashboard

**Location & Discovery**
- GPS-based location detection with Reverse Geocoding
- City normalization (maps specific coordinates/localities to normalized service areas)
- Location-based restaurant filtering
- Global Search (searches restaurants, cuisines, and specific dishes)
- Multi-filter system (Pure Veg, Fast Delivery < 30 mins, Rating 4.0+)
- Restaurant detail pages with menu rendering

**Shopping & Cart**
- Dynamic server-side cart with a sliding frontend sidebar
- Quantity controls (add/remove) with automatic backend synchronization
- Smooth add-to-cart animations and toast notifications

**Checkout & Addresses**
- Saved delivery addresses management (CRUD operations)
- GPS-assisted address autofill via a professional modal
- End-to-end checkout flow
- Dynamic tax & delivery fee calculations

**Orders & Tracking**
- Comprehensive order history view
- Simulated order lifecycle (progresses from Confirming → Preparing → Out for Delivery → Delivered based on timestamp)
- Zomato-style horizontal Order Tracking UI
- Professional formatted order IDs (e.g., `CRV-2026-0010`)
- Instant "Reorder" functionality

**UI/UX Quality**
- Swiggy/Zomato-inspired premium, responsive layout
- Skeleton loaders for seamless data fetching
- Defensive rendering (optional chaining, safe array checks) to prevent runtime crashes
- Reusable component architecture (modals, dropdowns, cards)

---

## 💻 Tech Stack

### Frontend
* React (Vite)
* React Router DOM
* Context API (Auth, Location)
* Axios (interceptors + CSRF handling)
* Lucide React (Icons)
* Custom Vanilla CSS (Modern CSS variables, Flexbox/Grid)

### Backend
* Django
* Django REST Framework (DRF)
* SimpleJWT (Customized for cookie-based auth)
* SQLite (Easily swappable to PostgreSQL)

---

## 🏛 Architecture Overview

CraveBites follows a decoupled client-server model:

* **Frontend (React SPA):** Focuses heavily on a premium user experience. Utilizes a highly **reusable component architecture** (like the Address Modal, Cart Overlay, and Profile Dropdowns) to keep the codebase DRY. Employs strict **defensive rendering** and error handling to ensure the UI never crashes on missing data or undefined states.
* **Backend (Django REST Framework):** Acts as the strict single source of truth. Validates all cart operations, pricing calculations, and enforces CSRF/JWT protection. 
* **Location Normalization:** Uses reverse geocoding to fetch raw location data, which is then normalized into standard city names (e.g., "Bangalore") to accurately query the backend for available restaurants in that specific region.

---

## ⚙️ Installation & Setup

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed database with realistic restaurants, categories, and food items
python seed_db.py

# Start the server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

The application will be typically available at `http://localhost:5173/` or `http://localhost:5174/` (as specified by Vite).

---

## 🔌 API Overview

| Method | Endpoint                 | Description      | Auth |
| ------ | ------------------------ | ---------------- | ---- |
| POST   | `/api/auth/token/`       | Login            | ❌    |
| POST   | `/api/auth/token/refresh/`| Refresh token   | ❌    |
| GET    | `/api/auth/me/`          | User profile     | ✅    |
| PUT    | `/api/auth/me/update/`   | Update profile   | ✅    |
| GET    | `/api/restaurants/`      | List restaurants | ✅    |
| GET    | `/api/categories/`       | List categories  | ✅    |
| POST   | `/api/cart/add_item/`    | Add item to cart | ✅    |
| POST   | `/api/orders/place_order/`| Place order     | ✅    |
| GET    | `/api/orders/`           | Order history    | ✅    |

---



## 📎 Future Improvements

- Add light/dark mode toggle.
- Integrate a live payment gateway (Stripe/Razorpay test mode).
- Implement infinite scrolling for restaurant listings.
- Add user reviews and ratings for past orders.

---

## 👤 Author

Developed as a demonstration of thoughtful full-stack engineering.
