export default class Board {
  constructor(canvas, context, players, rounds, ball, winner) {
    this.canvas = canvas;
    this.ctx = context;
    this.players = players;
    this.rounds = rounds;
    this.ball = ball;
    this.winner = winner;
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
}
