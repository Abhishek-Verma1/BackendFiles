import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { GameService } from '../services/Game.service.js';
import { UserStats } from '../services/Stats.service.js';

const router = express.Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get user game statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGames:
 *                   type: integer
 *                   description: Total number of games played
 *                 wins:
 *                   type: integer
 *                   description: Number of games won
 *                 losses:
 *                   type: integer
 *                   description: Number of games lost
 *                 draws:
 *                   type: integer
 *                   description: Number of games drawn
 *       400:
 *         description: Error retrieving user statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const data = await UserStats.getUserStats(req.auth.id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
