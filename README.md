# HopeConnect 🌍

> A full-stack digital fundraising platform connecting donors with NGOs and enabling transparent, impactful giving.

**Live Demo:** [hopeconnect-ngo.vercel.app](https://hopeconnect-ngo.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Overview

HopeConnect is a production-ready fundraising platform built for NGOs to showcase projects, receive donations, and manage donor engagement. It supports both monetary (M-Pesa) and in-kind donations (food, clothes, etc.), with a complete admin dashboard for campaign management and Google Analytics 4 tracking across the donation funnel.

---

## Features

### Donor-Facing
- 🔐 Secure authentication — Google OAuth 2.0 (Firebase) and email/password (JWT)
- 💰 Multi-type donations — Money (M-Pesa), Food, Clothes, Other
- 🎯 Recipient group selection — Refugees, Orphans, Street Families, War-affected
- ✅ Donation confirmation with automatic form reset for seamless multi-donor sessions
- 📱 Fully responsive, mobile-first UI

### Admin Dashboard
- 📋 Create, manage, and track NGO projects and campaigns
- 👥 View donor activity and donation records
- 🔒 Role-based access control — admin vs donor enforced at API level

### Analytics
- 📊 Google Analytics 4 — page view tracking and custom event tracking
- 🔍 Events tracked: donation type selection, recipient selection, form submission, auth actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TailwindCSS, React Router v6 |
| Backend | Python, Flask, Flask-JWT-Extended |
| Database | PostgreSQL, SQLAlchemy, Flask-Migrate |
| Authentication | Firebase Auth (Google OAuth 2.0), JWT |
| Analytics | Google Analytics 4 (react-ga4) |
| Deployment | Vercel (frontend), Render (backend) |
| CI/CD | GitHub (auto-deploy on push) |

---

## Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   React Frontend    │ ──────► │   Flask REST API      │
│   (Vercel)          │  HTTP   │   (Render)            │
│                     │ ◄────── │                       │
└────────┬────────────┘  JSON   └──────────┬───────────┘
         │                                  │
         │ Firebase Auth                    │ SQLAlchemy
         ▼                                  ▼
┌─────────────────────┐         ┌──────────────────────┐
│   Firebase          │         │   PostgreSQL          │
│   (Google Auth)     │         │   (Render DB)         │
└─────────────────────┘         └──────────────────────┘
```

**Auth Flow:**
1. User signs in via Google (Firebase) or email/password (Flask backend)
2. Firebase issues an ID token (Google login) OR Flask issues a JWT (email login)
3. Token stored in `localStorage`, sent as `Authorization: Bearer <token>` on protected requests
4. Backend verifies token and enforces role-based permissions

---

## Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- PostgreSQL
- Firebase project

### Frontend Setup

```bash
git clone https://github.com/clairekimani123/HOPECONNECT-NGO
cd HOPECONNECT-NGO
npm install
npm run dev
```

### Backend Setup

```bash
git clone https://github.com/clairekimani123/CONNECT-BACKEND
cd CONNECT-BACKEND
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
flask run
```

---

## Environment Variables

### Frontend (`client/.env`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Backend (`.env`)

```env
DATABASE_URI=postgresql://user:password@host/dbname
JWT_SECRET_KEY=your_jwt_secret
JWT_ACCESS_TOKEN_EXPIRES=3600
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/login` | Email/password login | None |
| POST | `/auth/register` | Register new user | None |
| POST | `/auth/firebase-login` | Google OAuth login | None |

### Projects

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/projects` | List all projects | None |
| POST | `/projects` | Create a project | Admin |
| PUT | `/projects/<id>` | Update a project | Admin |
| DELETE | `/projects/<id>` | Delete a project | Admin |

### Donations

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/donations` | List all donations | Admin |
| POST | `/donations` | Submit a donation | User |

---

## Authentication

HopeConnect uses a dual authentication system:

**Google OAuth (Firebase)**
- Handled client-side via `signInWithPopup`
- `onAuthStateChanged` fires on success and calls `/auth/firebase-login` to sync the user in the backend
- Requires `Cross-Origin-Opener-Policy: unsafe-none` header on the backend to allow popup communication

**Email/Password (JWT)**
- Credentials posted to `/auth/login`
- Backend returns a signed JWT stored in `localStorage`
- `AuthContext` persists session across page refreshes via `localStorage` fallback (prevents Firebase's `onAuthStateChanged` null state from wiping non-Firebase sessions)

**Role-Based Access Control**
- `donor` — browse projects, submit donations
- `admin` — full access including project management and donation records

---

## Deployment

### Frontend — Vercel
Push to `main` triggers automatic deployment. `vercel.json` handles SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Backend — Render
- Auto-deploys on push to `main`
- PostgreSQL database hosted on Render
- CORS restricted to `https://hopeconnect-ngo.vercel.app`
- `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` set to `unsafe-none` via `@app.after_request` to support Firebase popup auth

---

## Project Structure

```
hopeconnect/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Footer, ProjectCard...)
│   │   ├── context/         # AuthContext — global auth state management
│   │   ├── pages/           # LoginPage, DonatePage, ProjectsPage, HomePage...
│   │   ├── analytics.js     # GA4 — initGA, trackPageView, trackEvent
│   │   └── firebase.js      # Firebase app config and auth exports
│   └── vercel.json          # SPA routing config
│
└── server/                  # Flask backend
    ├── controller/          # Route blueprints (auth, projects, donations...)
    ├── models/              # SQLAlchemy models (User, Project, Donation...)
    ├── config.py            # DB URI, JWT config, extension instances
    └── app.py               # App factory, CORS, blueprint registration
```

---

## Author

**Claire Kimani** — [kimaniclaire3@gmail.com](mailto:kimaniclaire3@gmail.com) · [GitHub](https://github.com/clairekimani123)