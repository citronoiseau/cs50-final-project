// Class for ball object to have easy control on size, speed and position.
export default class Ball {
  constructor(dx, dy, positionX, positionY, radius) {
    this.dx = dx; // Speed in x direction
    this.dy = dy; // Speed in y direction
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = radius;
  }

  reset(canvas) {
    this.positionX = canvas.width / 2;
    this.positionY = canvas.height / 2;
  }

  setSpeed(speed) {
    this.dx = speed;
    this.dy = speed;
  }

  checkPaddleCollision(paddle) {
    // Check for collision between ball and paddle
    if (
      this.positionX + this.radius >= paddle.x &&
      this.positionX - this.radius <= paddle.x + paddle.width &&
      this.positionY + this.radius >= paddle.y &&
      this.positionY - this.radius <= paddle.y + paddle.height
    ) {
      this.dx = -this.dx;
    }
  }

  moveBall(canvas, player1, player2) {
    // Check for left wall collision (Player 2 scores)
    if (this.positionX - this.radius <= 0) {
      player2.updateScore();
      return true;
    }

    // Check for right wall collision (Player 1 scores)
    if (this.positionX + this.radius >= canvas.width) {
      player1.updateScore();
      return true;
    }

    if (
      this.positionY - this.radius <= 0 ||
      this.positionY + this.radius >= canvas.height
    ) {
      this.dy = -this.dy;
    }

    // Check if ball collides with paddle
    this.checkPaddleCollision(player1.paddle);
    this.checkPaddleCollision(player2.paddle);

    this.positionX += this.dx;
    this.positionY += this.dy;
  }

  // Using canvas API to create smooth game flow. Drawing a ball here.
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
