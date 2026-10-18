const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const Traveler = require('../models/Traveler');

const router = express.Router();

// Apply auth middleware to all trip routes
router.use(auth);

// GET /api/trips - list all trips for logged-in agency
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { agencyId: req.agencyId },
      include: [{ model: Traveler, attributes: ['id', 'name', 'travelerId', 'phone'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(trips);
  } catch (err) {
    console.error('Fetch trips error:', err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// POST /api/trips - create a new trip
router.post('/', async (req, res) => {
  try {
    const { name, destination, startDate, endDate } = req.body;
    if (!name || !destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, destination, startDate, and endDate are required' });
    }

    const trip = await Trip.create({
      agencyId: req.agencyId,
      name,
      destination,
      startDate,
      endDate,
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// GET /api/trips/:tripId - get trip + all travelers
router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.tripId, agencyId: req.agencyId },
      include: [{ model: Traveler, order: [['createdAt', 'ASC']] }],
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (err) {
    console.error('Get trip detail error:', err);
    res.status(500).json({ error: 'Failed to fetch trip details' });
  }
});

// DELETE /api/trips/:tripId - delete a trip
router.delete('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.tripId, agencyId: req.agencyId },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    console.error('Delete trip error:', err);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

module.exports = router;
