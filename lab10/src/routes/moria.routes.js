import express from 'express';
import { startChallenge, askGatekeeper, resetChallenge } from '../controllers/moria.controller.js';

const router = express.Router();

// GET /api/v1/moria/start - Get initial riddle
router.get('/start', startChallenge);

// POST /api/v1/moria/ask - Send answer
router.post('/ask', askGatekeeper);

// POST /api/v1/moria/reset - Reset riddle (optional)
router.post('/reset', resetChallenge);

export default router;