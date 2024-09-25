export default class Board {
  constructor(canvas, context, players, rounds, ball) {
    this.canvas = canvas;
    this.ctx = context;
    this.players = players;
    this.rounds = rounds;
    this.ball = ball;
  }

  updateRounds() {
    this.rounds += 1;
  }
}
