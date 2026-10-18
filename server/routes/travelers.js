const express = require('express');
const auth = require('../middleware/auth');
const Traveler = require('../models/Traveler');
const Trip = require('../models/Trip');
const Agency = require('../models/Agency');

const router = express.Router();

// GET /api/travelers/:travelerId - PUBLIC, NO AUTH REQUIRED
router.get('/:travelerId', async (req, res) => {
  try {
    const { travelerId } = req.params;
    const traveler = await Traveler.findOne({
      where: { travelerId },
      include: [
        {
          model: Trip,
          include: [{ model: Agency, attributes: ['name'] }],
        },
      ],
    });

    if (!traveler || !traveler.Trip) {
      return res.status(404).json({ error: 'Traveler not found. Please contact your travel agency.' });
    }

    res.json({
      travelerId: traveler.travelerId,
      name: traveler.name,
      phone: traveler.phone,
      tripName: traveler.Trip.name,
      destination: traveler.Trip.destination,
      agencyName: traveler.Trip.Agency ? traveler.Trip.Agency.name : 'Travel Agency',
    });
  } catch (err) {
    console.error('Fetch public traveler error:', err);
    res.status(500).json({ error: 'Failed to fetch traveler information' });
  }
});

// POST /api/travelers - Add traveler to trip (Auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { tripId, name, phone } = req.body;
    if (!tripId || !name) {
      return res.status(400).json({ error: 'Trip ID and traveler name are required' });
    }

    // Ensure trip belongs to logged-in agency
    const trip = await Trip.findOne({
      where: { id: tripId, agencyId: req.agencyId },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized' });
    }

    // Auto-generate unique travelerId (format TRV-XXXX)
    let travelerId, exists;
    do {
      travelerId = `TRV-${Math.floor(1000 + Math.random() * 9000)}`;
      exists = await Traveler.findOne({ where: { travelerId } });
    } while (exists);

    const traveler = await Traveler.create({
      tripId,
      name,
      phone: phone || null,
      travelerId,
    });

    res.status(201).json(traveler);
  } catch (err) {
    console.error('Create traveler error:', err);
    res.status(500).json({ error: 'Failed to create traveler' });
  }
});

// DELETE /api/travelers/:id - Delete traveler (Auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const traveler = await Traveler.findOne({
      where: { id: req.params.id },
      include: [{ model: Trip }],
    });

    if (!traveler || !traveler.Trip || traveler.Trip.agencyId !== req.agencyId) {
      return res.status(404).json({ error: 'Traveler not found or unauthorized' });
    }

    await traveler.destroy();
    res.json({ message: 'Traveler deleted successfully' });
  } catch (err) {
    console.error('Delete traveler error:', err);
    res.status(500).json({ error: 'Failed to delete traveler' });
  }
});

module.exports = router;
