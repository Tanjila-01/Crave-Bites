# 🍔 CraveBites

![CraveBites Cover](https://via.placeholder.com/1200x400?text=CraveBites+-+A+Premium+Food+Delivery+Experience)

CraveBites is a modern, production-grade food delivery application built with a **Django REST Framework** backend and a responsive **React (Vite)** frontend. Designed with a strict "Zero Trust" architecture, it ensures robust security, optimized database interactions, and a seamless user experience from browsing menus to secure checkout via Razorpay.

---

## 🏛 Architecture Overview

The system operates on a decoupled client-server architecture:
- **Frontend (React SPA):** A lightning-fast, reactive user interface responsible strictly for presentation and user input. It does not calculate prices or trust local state for checkout.
- **Backend (Django REST):** The single source of truth. It manages business logic, re-calculates cart totals natively from the database to prevent manipulation, enforces strict CSRF and JWT security protocols, and manages integrations with external services like Redis and Razorpay.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **HttpOnly Cookie JWTs:** Access and refresh tokens are stripped from JSON responses and securely transported via `HttpOnly`, `Secure`, and `SameSite=Lax` cookies, shielding them from XSS attacks.
- **Strict CSRF Enforcement:** Cross-Site Request Forgery (CSRF) tokens are rigidly enforced on all mutating requests (POST/PUT/DELETE) to secure the cookie-based auth flow.
- **Zero-Trust Pricing:** The backend completely ignores frontend price submissions, recalculating cart totals natively before initializing payment gateways.

### 🛒 Cart & Order Management
- **Persistent Server-Side Cart:** Cart state is securely tied to the user's database profile, allowing them to resume shopping across devices.
- **Atomic Transactions:** Order creation and cart clearing are bundled in `transaction.atomic()` blocks, ensuring race conditions never result in duplicate orders.

### 💳 Payments
- **Razorpay Integration:** Server-to-server Razorpay integration to generate encrypted order IDs.
- **Cryptographic Verification:** The backend verifies the HMAC SHA256 payment signature locally before confirming orders, preventing tampered success callbacks.

### ⚡ Performance Optimization
- **Redis Caching:** High-traffic endpoints (like Restaurant and Category listings) are heavily cached via Redis to reduce database load.
- **Query Optimization:** Eliminates N+1 query problems using Django's `select_related` and `prefetch_related` on deeply nested models.

---

## 💻 Tech Stack

**Frontend**
- React 18 (Vite)
- React Router DOM
- Axios (with global interceptors & CSRF handling)
- Vanilla CSS / Lucide React Icons

**Backend**
- Python / Django 6.x
- Django REST Framework (DRF)
- SimpleJWT (Custom Cookie Implementation)
- Razorpay Python SDK
- PostgreSQL / SQLite
- Redis

---

## 📂 Folder Structure

```text
backend/
├── core/                 # Main Django settings, root URLs, and exceptions
├── orders/               # Cart and Order models, views, and Razorpay logic
├── restaurants/          # Restaurants, Categories, and MenuItems (cached)
└── users/                # Custom auth, User profiles, and HttpOnly JWT views

frontend/
├── src/
│   ├── assets/           # Static images and icons
│   ├── context/          # Global AuthContext (Cookie-hydrated)
│   ├── hooks/            # Custom hooks (e.g., useCart)
│   ├── pages/            # View components (Home, Checkout, Orders)
│   └── services/         # Axios interceptors and API configuration
```

---

## 📸 Screenshots

| Home Page | Cart & Checkout | Payment Gateway |
| :---: | :---: | :---: |
| ![Home](https://via.placeholder.com/300x600?text=Home+Page) | ![Cart](https://via.placeholder.com/300x600?text=Checkout+Flow) | ![Payment](https://via.placeholder.com/300x600?text=Razorpay+Modal) |

---

## 🔄 User Flow

1. **Auth:** User registers or logs in. Backend returns `HttpOnly` cookies. Frontend hydrates user data via `/api/auth/me/`.
2. **Browse:** User views restaurants. Requests hit Redis cache first, falling back to DB if expired.
3. **Cart:** User adds items. Frontend calls backend `@action` endpoints; backend enforces CSRF, verifies restaurant is open, and updates DB cart.
4. **Checkout:** User initiates order. Backend re-calculates total from DB prices, creates Order, clears Cart atomically.
5. **Payment:** Backend generates `razorpay_order_id`. Frontend opens Razorpay UI.
6. **Verification:** Razorpay succeeds. Frontend passes signatures to backend. Backend validates HMAC signature and marks order as paid.

---

## 🔌 Key API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/token/` | Login (Sets HttpOnly JWT cookies) | ❌ |
| `POST` | `/api/auth/token/refresh/`| Refreshes access token via cookie | ❌ |
| `GET`  | `/api/auth/me/` | Retrieves active user profile | ✅ |
| `GET`  | `/api/restaurants/` | Lists open restaurants (Redis Cached) | ✅ |
| `POST` | `/api/orders/cart/add_item/` | Adds item to server-side cart | ✅ |
| `POST` | `/api/orders/orders/place_order/`| Creates order natively, clears cart | ✅ |
| `POST` | `/api/orders/payment/create/`| Initializes Razorpay Order | ✅ |
| `POST` | `/api/orders/payment/verify/`| Verifies cryptographic signature | ✅ |

---

## ⚙️ Setup Instructions

### Environment Variables
Create a `.env` file in the project root:

```env
SECRET_KEY=your-django-secret
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Leave False for SQLite)
USE_POSTGRES=False
POSTGRES_DB=cravebites
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis
REDIS_URL=redis://127.0.0.1:6379/1

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret_key
```

### Option 1: Docker (Recommended)
Make sure Docker and Docker Compose are installed.
```bash
docker-compose up --build
```
*Frontend will run on `localhost:5173`, Backend on `localhost:8000`.*

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment Notes

When moving to production, ensure the following configurations are set:
1. **DEBUG:** Must be set to `False` in your `.env`.
2. **CORS & CSRF:** Update `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` in `settings.py` to match your actual production frontend domain (e.g., `https://cravebites.com`).
3. **Database:** Switch `USE_POSTGRES=True` and configure connection pooling (e.g., PgBouncer).
4. **HTTPS:** `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` automatically engage when `DEBUG=False`, but you must serve your app over HTTPS for cookies to be accepted by modern browsers.

---

## 🔮 Future Improvements

- [ ] **WebSockets:** Implement Django Channels for real-time order tracking and delivery partner location.
- [ ] **Admin Dashboard:** Create a separate React app or expand the Django Admin for restaurant owners to manage menus and view analytics.
- [ ] **Search & Filtering Engine:** Integrate Elasticsearch or Typesense for typo-tolerant, lightning-fast food discovery.
- [ ] **Background Tasks:** Offload email confirmations and invoice generation to Celery.
