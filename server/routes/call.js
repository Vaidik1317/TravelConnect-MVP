const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * GET /api/call/token?travelerId=TRV-XXXX&role=moderator|participant
 *
 * Generates a JaaS (Jitsi as a Service) JWT token.
 * - role=moderator  → used by the traveler (caller from abroad)
 * - role=participant → used by family members (no lobby, but not moderator)
 *
 * JaaS JWT spec: https://developer.8x8.com/jaas/docs/api-keys-jwt
 */
router.get('/token', (req, res) => {
  try {
    const { travelerId, role } = req.query;

    if (!travelerId) {
      return res.status(400).json({ error: 'travelerId is required' });
    }

    const appId = process.env.JAAS_APP_ID;
    const keyId = process.env.JAAS_KEY_ID;
    const privateKey = process.env.JAAS_PRIVATE_KEY
      ? process.env.JAAS_PRIVATE_KEY.replace(/\\n/g, '\n')
      : null;

    // If JaaS credentials are not configured, return a flag so the
    // frontend can fall back to the plain URL (for development/testing).
    if (
      !appId || appId.includes('REPLACE_ME') ||
      !keyId || keyId.includes('REPLACE_ME') ||
      !privateKey || privateKey.includes('PASTE_YOUR_KEY')
    ) {
      return res.json({ configured: false });
    }

    const isModerator = role === 'moderator';
    const roomName = `TravelConnect-${travelerId}`;

    const payload = {
      iss: 'chat',
      aud: 'jitsi',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
      nbf: Math.floor(Date.now() / 1000) - 10,
      sub: appId,
      room: roomName,
      context: {
        user: {
          id: uuidv4(),
          name: isModerator ? 'Traveler' : 'Family Member',
          moderator: isModerator,
          'hidden-from-recorder': false,
        },
        features: {
          livestreaming: false,
          'outbound-call': false,
          transcription: false,
          recording: false,
        },
      },
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      header: { alg: 'RS256', kid: keyId, typ: 'JWT' },
    });

    res.json({
      configured: true,
      token,
      roomUrl: `https://8x8.vc/${appId}/${roomName}?jwt=${token}`,
    });
  } catch (err) {
    console.error('JaaS token generation error:', err);
    res.status(500).json({ error: 'Failed to generate call token', details: err.message });
  }
});

module.exports = router;
