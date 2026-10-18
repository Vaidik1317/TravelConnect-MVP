# TravelConnect — White-Label Video Calling Platform for Travel Agencies

TravelConnect gives travel agencies a simple web platform to assign unique IDs and shareable links to travelers. Travelers and family members can video call each other globally — including from countries where apps like WhatsApp are blocked (e.g., UAE, China).

Powered by **Jitsi Meet** (100% free, browser-native, zero billing).

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL with Sequelize ORM & CLI migrations
- **Video Calling**: Jitsi Meet (embedded `<iframe>`)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+
- **PostgreSQL**: Running on `localhost:5432`

### 2. Database Setup
Create the PostgreSQL database named `travelconnect`:
```bash
createdb travelconnect
```
*(Or create it via pgAdmin / psql shell)*

### 3. Server Setup (`server/`)
```bash
cd server
npm install
```
Configure your environment variables in `server/.env` (refer to `server/.env.example`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travelconnect
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_secret_jwt_key
PORT=5000
```

Run database migrations:
```bash
npx sequelize-cli db:migrate
```

Start the Express backend:
```bash
npm run dev
# Server will run at http://localhost:5000
```

### 4. Client Setup (`client/`)
```bash
cd client
npm install
```

Configure your environment variables in `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite React dev server:
```bash
npm run dev
# Client will run at http://localhost:3000
```

---

## 🧪 End-to-End Walkthrough

1. Open `http://localhost:3000/login`
2. Register a new travel agency account (e.g. **Parivar Travels**).
3. On the **Agency Dashboard**, click **+ New Trip**. Enter destination and dates (e.g., *Dubai November 2026*).
4. Open the created trip to access the **Trip Detail** view.
5. Add a traveler (e.g., *Ramesh Patel*). A unique traveler ID badge (`TRV-XXXX`) is auto-generated.
6. Click **Copy Share Link** (`http://localhost:3000/join/TRV-XXXX`).
7. Open the copied share link in a new browser tab or mobile browser.
8. Click **"I'm the traveler (calling from abroad)"** to open the Jitsi video call room.
9. Open the share link in another tab, click **"I'm family (calling from India)"**, and join the video call instantly!

---

## 📁 Migration Commands

- Run migrations: `npx sequelize-cli db:migrate`
- Undo last migration: `npx sequelize-cli db:migrate:undo`
- Undo all migrations: `npx sequelize-cli db:migrate:undo:all`
