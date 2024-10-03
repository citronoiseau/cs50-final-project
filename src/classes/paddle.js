export default class Paddle {
  constructor(x, y, type, width, height) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.speed = 15;
    this.direction = 0;
    this.width = width;
    this.height = height;
  }

  checkCollision(canvas) {
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
    }
  }

  movePaddle(canvas) {
    this.y += this.speed * this.direction;
    this.checkCollision(canvas);
  }

  moveBotPaddle({ canvas, ball }) {
    const botCenter = this.y + this.height / 2;
    const ballCenter = ball.positionY;

    if (botCenter < ballCenter - 10) {
      this.y += this.speed;
    } else if (botCenter > ballCenter + 10) {
      this.y -= this.speed;
    }
    this.checkCollision(canvas);
  }

  reset(canvas) {
    if (this.type === "left") {
      this.x = 40;
      this.y = canvas.height / 2 - 50;
    } else {
      this.x = canvas.width - 50;
      this.y = canvas.height / 2 - 50;
    }
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
