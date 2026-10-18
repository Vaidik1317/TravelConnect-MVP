# TravelConnect — MVP Build Spec

> Hand this file to Antigravity and say:
> **"Build this project exactly as described. Start from scratch. Follow the folder structure, data models, API routes, and UI screens defined here."**

---

## What This Product Is

A white-label web platform that lets a travel agency give every traveler a unique ID and shareable link. Travelers and their family members use this link to video/voice call each other — even from countries where WhatsApp is blocked (e.g. UAE, China).

No app download required. Pure web, works on any browser.

**Why not Botim / WhatsApp / Zoom?** Those are either paid, blocked in certain countries, or require the other person to also have an account. This product is free forever, works in any country, and needs nothing except a browser.

---

## Calling Provider: Jitsi Meet (Free, Forever)

**Jitsi Meet** is open-source and completely free. No API key. No account. No per-minute billing. Ever.

How it works:
- Every traveler gets a unique room automatically — the room name is derived from their traveler ID
- Room URL format: `https://meet.jit.si/TravelConnect-TRV-4821`
- Anyone who opens the same URL joins the same call
- Embed as a simple `<iframe>` — no SDK, no setup

This means:
- No `/api/call` backend route needed
- No third-party account needed
- Zero cost no matter how many travelers use it
- If the product grows, self-host Jitsi on a cheap VPS (₹500/month) — still free

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Sequelize + sequelize-cli |
| Video/Voice Calling | Jitsi Meet (free, iframe embed) |
| Auth | JWT |
| Styling | Tailwind CSS |

---

## Folder Structure

```
travelconnect/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AgencyLogin.jsx
│   │   │   ├── AgencyDashboard.jsx
│   │   │   ├── TripDetail.jsx
│   │   │   ├── JoinCall.jsx       # public — traveler + family entry point
│   │   │   └── CallRoom.jsx       # Jitsi iframe embed
│   │   ├── components/
│   │   │   ├── TripCard.jsx
│   │   │   ├── TravelerRow.jsx
│   │   │   └── Navbar.jsx
│   │   ├── api.js                 # axios instance with JWT interceptor
│   │   └── main.jsx
│   └── index.html
│
├── server/                        # Express backend
│   ├── config/
│   │   └── config.json            # sequelize-cli DB config
│   ├── migrations/
│   │   ├── 01-create-agencies.js
│   │   ├── 02-create-trips.js
│   │   └── 03-create-travelers.js
│   ├── models/
│   │   ├── index.js               # Sequelize instance + connection
│   │   ├── Agency.js
│   │   ├── Trip.js
│   │   └── Traveler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── travelers.js
│   ├── middleware/
│   │   └── auth.js                # JWT verify middleware
│   ├── .sequelizerc               # tells CLI where config and migrations live
│   └── index.js
│
├── .env.example
└── README.md
```

---

## Environment Variables

`.env` in `server/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travelconnect
DB_USER=your_pg_user
DB_PASSWORD=your_pg_password
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

`.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## npm Packages for server/

```bash
npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv cors
npm install --save-dev sequelize-cli
```

---

## .sequelizerc

```js
const path = require('path');

module.exports = {
  config: path.resolve('config', 'config.json'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
};
```

---

## config/config.json

```json
{
  "development": {
    "username": "your_pg_user",
    "password": "your_pg_password",
    "database": "travelconnect",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  }
}
```

> Note: For MVP, hardcode values here or use env vars with `require('dotenv').config()` in `.sequelizerc`.

---

## Migrations

### server/migrations/01-create-agencies.js

```js
'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('agencies', {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('agencies', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
```

---

### server/migrations/02-create-trips.js

```js
'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('trips', {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        agency_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'agencies',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        destination: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        end_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('trips', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
```

---

### server/migrations/03-create-travelers.js

```js
'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('travelers', {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        trip_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'trips',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        traveler_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('travelers', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
```

---

## Models (Sequelize)

### server/models/index.js

```js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
```

---

### server/models/Agency.js

```js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Agency = sequelize.define('Agency', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'agencies',
  underscored: true,
});

module.exports = Agency;
```

---

### server/models/Trip.js

```js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Agency = require('./Agency');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'trips',
  underscored: true,
});

Agency.hasMany(Trip, { foreignKey: 'agencyId', onDelete: 'CASCADE' });
Trip.belongsTo(Agency, { foreignKey: 'agencyId' });

module.exports = Trip;
```

---

### server/models/Traveler.js

```js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Trip = require('./Trip');

const Traveler = sequelize.define('Traveler', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  travelerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'travelers',
  underscored: true,
});

Trip.hasMany(Traveler, { foreignKey: 'tripId', onDelete: 'CASCADE' });
Traveler.belongsTo(Trip, { foreignKey: 'tripId' });

module.exports = Traveler;
```

---

## server/index.js

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');

// Import models to register associations
require('./models/Agency');
require('./models/Trip');
require('./models/Traveler');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/trips',     require('./routes/trips'));
app.use('/api/travelers', require('./routes/travelers'));

const PORT = process.env.PORT || 5000;

// Just test the connection — migrations handle table creation
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
```

> **Important:** No `sequelize.sync()` anywhere. Tables are created only by running migrations.

---

## API Routes

### Auth — `/api/auth`

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Agency signs up | No |
| POST | `/login` | Returns JWT | No |

```js
// routes/auth.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Agency = require('../models/Agency');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const agency = await Agency.create({ name, email, password: hashed });
  const token = jwt.sign({ id: agency.id }, process.env.JWT_SECRET);
  res.json({ token, agency: { id: agency.id, name: agency.name } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const agency = await Agency.findOne({ where: { email } });
  if (!agency) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, agency.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: agency.id }, process.env.JWT_SECRET);
  res.json({ token, agency: { id: agency.id, name: agency.name } });
});
```

---

### Trips — `/api/trips`

All routes require `Authorization: Bearer <token>` header.

| Method | Route | Description |
|---|---|---|
| GET | `/` | List all trips for logged-in agency |
| POST | `/` | Create a new trip |
| GET | `/:tripId` | Get trip + all travelers |
| DELETE | `/:tripId` | Delete a trip |

---

### Travelers — `/api/travelers`

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/` | Add traveler to a trip | Yes |
| GET | `/:travelerId` | Get traveler info (public) | No |
| DELETE | `/:id` | Remove a traveler | Yes |

**Auto-generate unique travelerId:**
```js
let travelerId, exists;
do {
  travelerId = `TRV-${Math.floor(1000 + Math.random() * 9000)}`;
  exists = await Traveler.findOne({ where: { travelerId } });
} while (exists);
```

**Public GET response:**
```json
{
  "travelerId": "TRV-4821",
  "name": "Ramesh Patel",
  "tripName": "Dubai November 2026",
  "destination": "Dubai, UAE",
  "agencyName": "Parivar Travels"
}
```

---

## JWT Middleware (server/middleware/auth.js)

```js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.agencyId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## How the Call Works

No call API route. Room URL built on the frontend:

```js
const jitsiUrl = `https://meet.jit.si/TravelConnect-${travelerId}`;
// Embed as iframe. No backend. No API key. No cost.
```

---

## Frontend Pages

### 1. AgencyLogin.jsx (`/login`)
- Two tabs: Login / Register
- Login → POST `/api/auth/login` → save JWT to localStorage → redirect to `/dashboard`
- Register → POST `/api/auth/register` → auto-login → redirect to `/dashboard`

### 2. AgencyDashboard.jsx (`/dashboard`)
- Header: agency name + Logout button
- Grid of TripCard components (GET `/api/trips`)
- "New Trip" button → modal: Trip name, Destination, Start date, End date

### 3. TripDetail.jsx (`/dashboard/trips/:tripId`)
- Trip info at top
- Table: Name | Traveler ID | Phone | Share Link | Remove
- Share Link = `http://localhost:3000/join/TRV-4821` with copy-to-clipboard
- Traveler ID as indigo badge
- "Add Traveler" inline form → POST `/api/travelers`

### 4. JoinCall.jsx (`/join/:travelerId`) — PUBLIC, NO LOGIN
- GET `/api/travelers/:travelerId` on load
- Shows: agency name (muted), traveler name, trip + destination
- Two buttons — both redirect to `/room/:travelerId`:
  - "I'm the traveler (calling from abroad)"
  - "I'm family (calling from India)"
- If 404 → "Invalid link. Please contact your travel agency."

### 5. CallRoom.jsx (`/room/:travelerId`)

```jsx
import { useParams } from 'react-router-dom';

export default function CallRoom() {
  const { travelerId } = useParams();
  const jitsiUrl = `https://meet.jit.si/TravelConnect-${travelerId}`;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        src={jitsiUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="TravelConnect Call"
      />
    </div>
  );
}
```

---

## Frontend Routing

```jsx
<Routes>
  <Route path="/"                        element={<Navigate to="/login" />} />
  <Route path="/login"                   element={<AgencyLogin />} />
  <Route path="/dashboard"               element={<ProtectedRoute><AgencyDashboard /></ProtectedRoute>} />
  <Route path="/dashboard/trips/:tripId" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
  <Route path="/join/:travelerId"        element={<JoinCall />} />
  <Route path="/room/:travelerId"        element={<CallRoom />} />
</Routes>
```

---

## axios Instance (client/src/api.js)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## MVP End-to-End Test

1. Open `http://localhost:3000/login`
2. Register: "Parivar Travels", email, password → dashboard
3. Create trip: "Dubai November 2026", "Dubai, UAE", pick dates
4. Click trip → TripDetail
5. Add traveler: "Ramesh Patel", "9876543210" → `TRV-4821` appears
6. Copy link: `http://localhost:3000/join/TRV-4821`
7. Open in new tab → welcome screen → click "I'm the traveler" → Jitsi loads ✅
8. Open same link in another tab → click "I'm family" → same Jitsi room ✅
9. Both tabs see each other on video call ✅
10. Test on mobile browser — no install needed ✅

---

## What NOT to Build in MVP

- Email/SMS sending (agency shares link manually)
- White-label branding customization
- Traveler login/auth (ID is the access key)
- Payment or subscription
- Call history or recordings
- Mobile app

---

## Notes for Antigravity

- Use `bcryptjs` (not `bcrypt` — no native deps)
- Use `jsonwebtoken` for JWT
- Use `sequelize` + `pg` + `pg-hstore` — no Prisma
- **Never use `sequelize.sync()` in any form** — tables are created by migrations only
- Run `npx sequelize-cli db:migrate` to set up tables before starting the server
- `underscored: true` in model options maps camelCase JS fields to snake_case DB columns automatically
- Import all models in `server/index.js` before calling `sequelize.authenticate()` so associations are registered
- CORS: allow `http://localhost:3000` in development
- All API errors return `{ error: "message" }` with correct HTTP status
- Jitsi iframe must have `allow="camera; microphone; fullscreen; display-capture; autoplay"`
- Do NOT install any Jitsi npm package — iframe is the full integration

---

## README to Generate

1. Prerequisites: Node 18+, PostgreSQL running locally
2. `npm install` in both `client/` and `server/`
3. Create `.env` files from `.env.example`
4. Create the database: `createdb travelconnect`
5. Run migrations: `npx sequelize-cli db:migrate`
6. Start both: `npm run dev` in `client/` and `server/`
7. End-to-end test steps above
8. To undo migrations: `npx sequelize-cli db:migrate:undo:all`
9. No API keys or third-party accounts needed
