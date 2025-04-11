import axios from 'axios';

export class ExternalService {
  static async makeMove(data) {
    try {
      const result = await axios.post(`${process.env.PYTHON_API_URL}/make_move`, data);
      return result.data;
    } catch (error) {
      throw new Error('Error making move');
    }
  }

  static async checkGameStatus(data) {
    try {
      const result = await axios.post(`${process.env.PYTHON_API_URL}/check_game_state`, {
        board: data.board,
        current_player: 'x',
      });
      return result.data;
    } catch (error) {
      throw new Error('Error checking game status', error);
    }
  }
}
