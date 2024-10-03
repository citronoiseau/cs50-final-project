export default class Board {
  constructor(canvas, context, players, rounds, ball, winner, maxRounds = 5) {
    this.canvas = canvas;
    this.ctx = context;
    this.players = players;
    this.rounds = rounds;
    this.ball = ball;
    this.winner = winner;
    this.isPaused = false;
    this.maxRounds = maxRounds;
  }

  updateRounds() {
    this.rounds += 1;
  }

  setRounds(int) {
    this.rounds = int;
  }

  setWinner(name) {
    this.winner = name;
  }

  changeMaxRounds(int) {
    this.maxRounds = int;
  }
}
