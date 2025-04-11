import { ExternalService } from './External.service.js';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GameService {
  static async pcMove(prevBoard, userId, sessionId) {
    const result = await ExternalService.makeMove({
      board: prevBoard,
      current_player: 'o',
    });
    const { board, next_move } = result;
    const gameStatus = await ExternalService.checkGameStatus({ board });
    const { status } = gameStatus;
    await this.saveStatusToDB(status, userId);
    await prisma.gameSession.update({
      where: {
        id: parseInt(sessionId),
      },
      data: {
        board: JSON.stringify(board),
        currentPlayer: 'o',
        status: status,
        winner: status === 'x wins' ? 'x' : status === 'o wins' ? 'o' : null,
        userId: userId,
      },
    });
    return {
      board,
      next_move,
      status,
    };
  }

  static async playerMove(board, sessionId, userId) {
    const result = await ExternalService.checkGameStatus({ board });
    const { status } = result;
    await this.saveStatusToDB(status, userId);
    await prisma.gameSession.update({
      where: {
        id: parseInt(sessionId),
      },
      data: {
        board: JSON.stringify(board),
        currentPlayer: 'x',
        status: status,
        winner: status === 'x wins' ? 'x' : status === 'o wins' ? 'o' : null,
        userId: userId,
      },
    });

    return {
      status,
    };
  }

  static async createGameSession(userId, startWithPlayer) {
    const initBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const gameSession = await prisma.gameSession.create({
      data: {
        board: JSON.stringify(initBoard),
        currentPlayer: startWithPlayer ? 'x' : 'o',
        status: 'ongoing',
        userId: userId,
      },
    });
    return gameSession;
  }

  static async saveStatusToDB(status, userId) {
    if (status === 'ongoing') {
      return status;
    } else {
      const currentUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          stats: true,
        },
      });
      if (status === 'draw') {
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            stats: {
              update: {
                draws: currentUser.stats.draws + 1,
              },
            },
          },
        });
      } else if (status === 'x wins') {
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            stats: {
              update: {
                wins: currentUser.stats.wins + 1,
              },
            },
          },
        });
      } else if (status === 'o wins') {
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            stats: {
              update: {
                losses: currentUser.stats.losses + 1,
              },
            },
          },
        });
      }
      return status;
    }
  }

  static async getGameSession(sessionId) {
    const gameSession = await prisma.gameSession.findUnique({
      where: {
        id: parseInt(sessionId),
      },
    });
    return gameSession;
  }
}
