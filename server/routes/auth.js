const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Agency = require('../models/Agency');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required' });
    }

    const existing = await Agency.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'An agency with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const agency = await Agency.create({ name, email, password: hashed });
    const secret = process.env.JWT_SECRET || 'travelconnect_jwt_secret_key_2026';
    const token = jwt.sign({ id: agency.id }, secret, { expiresIn: '7d' });

    res.status(201).json({ token, agency: { id: agency.id, name: agency.name, email: agency.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const agency = await Agency.findOne({ where: { email } });
    if (!agency) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, agency.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'travelconnect_jwt_secret_key_2026';
    const token = jwt.sign({ id: agency.id }, secret, { expiresIn: '7d' });

    res.json({ token, agency: { id: agency.id, name: agency.name, email: agency.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Server error during login' });
  }
});

module.exports = router;
