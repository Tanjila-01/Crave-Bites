# 🍔 CraveBites

A modern full-stack food delivery platform built with **Django REST Framework (backend)** and **React (Vite frontend)**, designed with a secure, scalable, and production-oriented architecture.

---

## 🚀 Project Highlights

* 🔐 Secure HttpOnly cookie-based JWT authentication
* 🛒 Server-side cart as single source of truth
* ⚡ Optimized database queries (select_related / prefetch_related)
* 💳 End-to-end checkout pipeline (test payment flow)
* 🔄 Seamless token refresh using Axios interceptors
* 🧱 Decoupled frontend-backend architecture

---

## 🏛 Architecture Overview

CraveBites follows a decoupled client-server model:

### Frontend (React SPA)

* Handles UI rendering and user interactions only
* State managed via Context API and custom hooks
* Communicates with backend via REST APIs
* Does NOT compute pricing or business logic

### Backend (Django REST Framework)

* Core business logic and authentication layer
* Maintains cart, orders, and pricing calculations
* Enforces CSRF protection and JWT authentication
* Acts as the single source of truth for all data

---

## ✨ Features

### 🔐 Authentication & Security

* JWT stored in HttpOnly, Secure cookies
* CSRF protection for all state-changing requests
* Automatic token refresh via API interceptors
* XSS-resistant token handling (no localStorage usage)

### 🛒 Cart & Orders

* Persistent server-side cart linked to user profile
* Backend validates all cart operations
* Atomic transactions ensure safe order creation
* Full order history tracking with status updates

### 💳 Checkout Flow

* End-to-end simulated payment system
* Supports Card / UPI / COD (test mode only)
* Backend recalculates totals securely before order creation
* Cart cleared only after successful order placement

### ⚡ Performance Optimizations

* Optimized ORM queries to prevent N+1 problems
* Image compression via URL transformation
* Efficient API response structures
* Pre-seeded database for fast development setup

---

## 💻 Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios (interceptors + CSRF handling)
* Context API

### Backend

* Django
* Django REST Framework
* SimpleJWT (cookie-based implementation)
* SQLite / PostgreSQL

---

## 📂 Folder Structure

### Backend

```
backend/
├── core/           # Settings, URLs, config
├── users/          # Authentication & user profiles
├── restaurants/    # Restaurants & menu items
├── orders/         # Cart, orders, payment logic
```

### Frontend

```
frontend/
├── src/
│   ├── assets/
│   ├── context/     # Auth context
│   ├── hooks/       # Custom hooks (cart, auth)
│   ├── pages/       # UI pages
│   ├── services/    # Axios API layer
```

---

## 🔄 User Flow

1. User logs in → backend sets HttpOnly cookies
2. Frontend fetches user via `/api/auth/me/`
3. User browses restaurants and menu items
4. Items added to server-side cart
5. Backend validates and stores cart state
6. Checkout triggers order creation (atomic transaction)
7. Payment simulated and order marked as paid
8. Cart is cleared and order history updated

---

## 🔌 API Endpoints

| Method | Endpoint                 | Description      | Auth |
| ------ | ------------------------ | ---------------- | ---- |
| POST   | /api/auth/token/         | Login            | ❌    |
| POST   | /api/auth/token/refresh/ | Refresh token    | ❌    |
| GET    | /api/auth/me/            | User profile     | ✅    |
| GET    | /api/restaurants/        | List restaurants | ✅    |
| POST   | /api/cart/add_item/      | Add item to cart | ✅    |
| POST   | /api/orders/place_order/ | Place order      | ✅    |
| POST   | /api/payment/create/     | Initiate payment | ✅    |

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed_db.py
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

```
SECRET_KEY=your-secret
DEBUG=True
USE_POSTGRES=False
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 🚀 Deployment Notes

* Set `DEBUG=False` in production
* Configure `CORS_ALLOWED_ORIGINS` properly
* Enable PostgreSQL for production use
* Use HTTPS for secure cookie transmission
* Ensure CSRF_TRUSTED_ORIGINS includes frontend domain

---

## 📌 Summary

CraveBites is a production-oriented full-stack food delivery system emphasizing:

* Security-first authentication design
* Backend-driven business logic
* Scalable REST API architecture
* Optimized database performance

---

## 📎 Future Improvements

* Real payment gateway integration (Stripe/Razorpay live mode)
* WebSockets for live order tracking
* Admin dashboard for restaurant owners
* Redis caching layer for performance boost
