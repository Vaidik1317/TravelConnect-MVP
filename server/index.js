require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');

// Import models to register associations
require('./models/Agency');
require('./models/Trip');
require('./models/Traveler');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow localhost on any port
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    // Allow any 192.168.x.x (local WiFi network) on any port
    if (/^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)) return callback(null, true);
    // Allow custom origin from .env
    if (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN) return callback(null, true);
    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/trips',     require('./routes/trips'));
app.use('/api/travelers', require('./routes/travelers'));
app.use('/api/call',      require('./routes/call'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Sync DB tables then start server (creates tables if they don't exist)
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 TravelConnect Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database sync error:', err.message);
    process.exit(1);
  });
