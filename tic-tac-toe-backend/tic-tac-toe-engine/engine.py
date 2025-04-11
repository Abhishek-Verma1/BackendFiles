import numpy as np

LENGTH = 3  # Board Length, currently supports only 3

class Environment:
    def __init__(self):
        self.board = np.zeros((LENGTH, LENGTH))
        self.x = -1
        self.o = 1
        self.winner = None
        self.ended = False
        self.num_states = 3 ** (LENGTH * LENGTH)

    def is_empty(self, i, j):
        return self.board[i, j] == 0

    def set_state(self, state):
        self.board = np.reshape(state, (LENGTH, LENGTH))
        self.ended = False  # Reset ended status when setting a new state
        self.game_over(force_recalculate=True)
        if self.ended:
            raise ValueError("Game already ended. Please reset the game.")

    def reward(self, sym):
        if not self.game_over():
            return 0
        return 1 if self.winner == sym else 0

    def get_state(self):
        k = 0
        h = 0
        for i in range(LENGTH):
            for j in range(LENGTH):
                if self.board[i, j] == 0:
                    v = 0
                elif self.board[i, j] == self.x:
                    v = 1
                elif self.board[i, j] == self.o:
                    v = 2
                h += (3 ** k) * v
                k += 1
        return h

    def game_over(self, force_recalculate=False):
        if not force_recalculate and self.ended:
            return self.ended

        # check rows
        for i in range(LENGTH):
            for player in (self.x, self.o):
                if self.board[i].sum() == player * LENGTH:
                    self.winner = player
                    self.ended = True
                    return True

        # check columns
        for j in range(LENGTH):
            for player in (self.x, self.o):
                if self.board[:, j].sum() == player * LENGTH:
                    self.winner = player
                    self.ended = True
                    return True

        # check diagonals
        for player in (self.x, self.o):
            # top-left -> bottom-right diagonal
            if self.board.trace() == player * LENGTH:
                self.winner = player
                self.ended = True
                return True
            # top-right -> bottom-left diagonal
            if np.fliplr(self.board).trace() == player * LENGTH:
                self.winner = player
                self.ended = True
                return True

        if np.all((self.board == 0) == False):
            # winner stays None
            self.winner = None
            self.ended = True
            return True

        self.winner = None
        return False

    def is_draw(self):
        return self.ended and self.winner is None

    def reset(self):
        self.board = np.zeros((LENGTH, LENGTH))
        self.winner = None
        self.ended = False

class AgentEval:
    def __init__(self, sym, value_sym):
        self.V = value_sym
        self.sym = sym

    def take_action(self, env):
        best_state = None
        pos2value = {}
        next_move = None
        best_value = -1
        for i in range(LENGTH):
            for j in range(LENGTH):
                if env.is_empty(i, j):
                    env.board[i, j] = self.sym
                    state = env.get_state()
                    env.board[i, j] = 0
                    pos2value[(i, j)] = self.V[state]
                    if self.V[state] > best_value:
                        best_value = self.V[state]
                        best_state = state
                        next_move = (i, j)
        if next_move is not None:
            env.board[next_move[0], next_move[1]] = self.sym
        return next_move
