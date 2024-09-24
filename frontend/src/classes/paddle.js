export default class Paddle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  movePaddle(dx) {
    this.x += dx;
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
