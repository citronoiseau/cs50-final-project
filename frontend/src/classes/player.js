export default class Player {
  constructor(type, name, paddle, score = 0) {
    this.type = type;
    this.name = name;
    this.paddle = paddle;
    this.score = score;
  }

  updateScore() {
    this.score += 1;
    console.log(`${this.name}: ${this.score}`);
  }
}
