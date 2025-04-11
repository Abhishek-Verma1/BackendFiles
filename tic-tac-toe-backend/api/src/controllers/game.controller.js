import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { GameService } from '../services/Game.service.js';
import { ExternalService } from '../services/External.service.js';

const router = express.Router();

/**
 * @swagger
 * /game/pc_move:
 *   post:
 *     summary: Make a computer move in the game
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - board
 *               - sessionId
 *             properties:
 *               board:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [[0, 0, 0], [0, -1, 0], [0, 0, 0]]
 *                 description: Current state of the game board as a 3x3 matrix
 *               sessionId:
 *                 type: string
 *                 description: ID of the current game session
 *     responses:
 *       201:
 *         description: Computer move successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: number
 *                   example: [[0, 0, 1], [0, -1, 0], [0, 0, 0]]
 *                 gameStatus:
 *                   type: string
 *                   enum: [ongoing, won, draw]
 *       400:
 *         description: Invalid move or game session
 *       401:
 *         description: Unauthorized
 */
router.post('/pc_move', authenticateJWT, async (req, res) => {
  try {
    const { board, sessionId } = req.body;
    const data = await GameService.pcMove(board, req.auth.id, sessionId);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /game/player_move:
 *   post:
 *     summary: Make a player move in the game
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - board
 *               - sessionId
 *             properties:
 *               board:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [[0, 0, 0], [0, -1, 0], [0, 0, 0]]
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player move successful
 *       400:
 *         description: Invalid move or game session
 *       401:
 *         description: Unauthorized
 */
router.post('/player_move', authenticateJWT, async (req, res) => {
  try {
    const { board, sessionId } = req.body;
    const data = await GameService.playerMove(board, sessionId, req.auth.id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /game/create_game_session:
 *   post:
 *     summary: Create a new game session
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startWithPlayer
 *             properties:
 *               startWithPlayer:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Game session created successfully
 *       400:
 *         description: Error creating game session
 *       401:
 *         description: Unauthorized
 */
router.post('/create_game_session', authenticateJWT, async (req, res) => {
  try {
    const { startWithPlayer } = req.body;
    const data = await GameService.createGameSession(req.auth.id, startWithPlayer);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /game:
 *   get:
 *     summary: Get game session details
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the game session to retrieve
 *     responses:
 *       200:
 *         description: Game session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 board:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: number
 *                   example: [[0, 0, 0], [0, -1, 0], [0, 0, 0]]
 *                 gameStatus:
 *                   type: string
 *                   enum: [ongoing, won, draw]
 *       400:
 *         description: Error retrieving game session
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { sessionId } = req.query;
    const data = await GameService.getGameSession(sessionId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /game/check_board:
 *   post:
 *     summary: Check the status of a game board
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - board
 *             properties:
 *               board:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [[0, 0, 0], [0, -1, 0], [0, 0, 0]]
 *     responses:
 *       200:
 *         description: Game board status retrieved successfully
 *       400:
 *         description: Error retrieving game board status
 *       401:
 *         description: Unauthorized
 */
router.post('/check_board', authenticateJWT, async (req, res) => {
  try {
    const { board } = req.body;
    const data = await ExternalService.checkGameStatus({ board });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
