<div align="center">
  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80" width="120" style="border-radius: 50%" alt="CraveBites Logo">
  <h1>🍔 CraveBites</h1>
  <p><strong>A premium, high-fidelity Food Delivery platform built with Django REST and React.</strong></p>
</div>

<br/>

CraveBites is an ultra-premium web application inspired by industry leaders like Swiggy and Zomato. It features a fully decoupled architecture, delivering a frictionless ordering experience through a high-performance React frontend and a secure, data-rich Django backend.

## ✨ Key Features
- **Ultra-Premium UI/UX**: Custom-designed aesthetic using Vanilla CSS, featuring glassmorphism, micro-animations, and a beautiful dark-mode marketing landing page.
- **Interactive Menu Catalog**: Dynamic category filtering that smartly instantly isolates matching restaurants and specific food items.
- **Frictionless Cart State**: "Silent Add" toggles mapped directly onto menu cards, mimicking industry-standard e-commerce flow.
- **Mock Payment Gateway**: Comprehensive checkout simulation supporting Credit/Debit Cards, UPI, and Cash on Delivery.
- **Secure Authentication**: JWT-based login/registration system that strictly protects the ordering catalog and user history.
- **Massive Realistic Database**: Pre-seeded SQLite database populated with top real-world restaurant chains, dynamic constraints, and 100+ unique menu items paired with high-quality mapping.

## 🛠️ Technology Stack
- **Frontend Architecture**: React 18, Vite, React Router, Axios, Lucide-React
- **Backend Architecture**: Django 6.x, Django REST Framework, SimpleJWT, SQLite
- **Server Deployment**: Configured to run concurrently via a single Node.js script.

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/Aditya-MP/Crave_Bites.git
cd "Crave_Bites"
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
.\venv\Scripts\activate  # Windows
# Install dependencies (Django, djangorestframework, djangorestframework-simplejwt, django-cors-headers)
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

### 4. Hydrate the Database
Navigate into the `backend` folder and run the seed script to heavily populate the application with real restaurants and menu items:
```bash
python seed.py
```

### 5. Run the Platform
Navigate back to the **ROOT** directory of the project (`Crave_Bites`) and start the integrated environment:
```bash
npm start
```
*This command uses `concurrently` to automatically launch both the Django Backend (`http://localhost:8000`) and the Vite Frontend.*
