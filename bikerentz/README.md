# BikeRentz — Motorbike & Scooter Rental Platform

Full-stack rental site for motorbikes and scooters. Same UI/layout structure as RatoNumber (car rental reference), rebuilt in KitabGhar's tech stack (TypeScript, Express, MongoDB/Mongoose), with Khalti payments.

## Structure

```
bikerentz/
├── backend/     Express + TypeScript + MongoDB API
├── frontend/    React 19 + Vite + TypeScript
└── docker-compose.yml
```

## Quick Start (local, without Docker)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT secrets, MAIL_*, KHALTI_SECRET_KEY
npm run seed   # creates an admin user + demo fleet
npm run dev    # starts API on http://localhost:5000
```

Default seeded admin login: `admin@bikerentz.com` / `Admin@123`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your API isn't on localhost:5000
npm run dev    # starts app on http://localhost:5173
```

### 3. Run tests (backend)

```bash
cd backend
npm run test:unit
npm run test:integration
```

## Quick Start (Docker)

```bash
# from the project root
cp backend/.env.example backend/.env
# edit backend/.env with real secrets before running
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

## Key Features

- JWT auth (register/login/logout/forgot-reset password via email)
- Browse/search/filter motorbikes & scooters by type, category, price
- Date-range booking with live price calculation
- Khalti payment integration (initiate → redirect → verify callback)
- "My Rentals" history for renters
- In-app notifications (booking confirmations, reminders)
- Admin panel: manage fleet, manage rental orders, manage users, dashboard stats
- Auto-completion of expired rentals via a scheduled cron job
