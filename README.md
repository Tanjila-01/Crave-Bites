# CraveBites Food Delivery System

CraveBites is a production-ready, full-stack food delivery web application built with a modern decoupled architecture. It features a robust Python/Django backend processing secure transactions and a lightning-fast React frontend offering a premium, real-world user experience.

![CraveBites Hero Image](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)

## 🚀 Features

- **Decoupled Architecture**: Django REST Framework API communicating securely with a Vite/React SPA.
- **Secure Authentication**: Custom User models with JSON Web Tokens (JWT) stored exclusively in HttpOnly cookies to prevent XSS attacks.
- **Persistent Cart System**: Server-side cart management ensuring seamless synchronization across devices.
- **Strict Financial Engine**: Cart-to-Order conversion guarantees server-side pricing validation preventing client-side payload tampering.
- **Payment Gateway**: Integrated with Razorpay's Python SDK and JS checkout UI for secure cryptographic order verification.
- **High Performance**: 
  - `Redis` API response caching.
  - `select_related` and `prefetch_related` database query optimizations.
  - PostgreSQL ready with indexed tables.
- **UX Excellence**: Empty state UIs, loading indicators, seamless micro-animations, and dynamic data filtering.
- **Containerized**: Fully Dockerized utilizing Gunicorn/Uvicorn for ASGI deployment.

## 🛠 Tech Stack

**Frontend:**
- React 18 (Vite)
- React Router DOM
- Axios (Intercepted & Configured)
- Lucide React (Icons)
- Vanilla CSS (Glassmorphism design)

**Backend:**
- Python 3.10+
- Django 5.x & Django REST Framework
- PostgreSQL (Production) / SQLite (Local)
- Redis (Caching Layer)
- Razorpay SDK
- SimpleJWT

## ⚙️ Local Development Setup

### Option 1: Docker (Recommended)

1. Clone the repository and navigate to the project root.
2. Fill out your `.env` variables (A sample configuration is provided inside the `.env` file).
3. Run the complete stack (Postgres, Redis, Django, React):
```bash
docker-compose up --build
```
The App will be available at `http://localhost`.

### Option 2: Manual Setup

**Backend (Terminal 1):**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python seed.py  # Populate realistic restaurant data!
python manage.py runserver
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security Measures Implemented

1. **HttpOnly Cookies**: JWT Access and Refresh tokens never touch LocalStorage.
2. **SameSite Configuration**: Hardened cookie policies against CSRF.
3. **Throttling**: 100/day Anon and 1000/day User API rate limits configured via DRF.
4. **Signature Verification**: Checkout process verifies Razorpay's SHA256 cryptographic signatures natively before marking orders as paid.

---
*Built with passion for high-performing engineering standards.*
