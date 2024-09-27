// Class for ball object to have easy control on size, speed and position.
export default class Ball {
  constructor(dx, dy, positionX, positionY, radius) {
    this.dx = dx; // Speed in x direction
    this.dy = dy; // Speed in y direction
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = radius;
    this.speedIncrement = 0.1;
    this.maxSpeed = 5;
  }

  reset(canvas) {
    this.positionX = canvas.width / 2;
    this.positionY = canvas.height / 2;
    this.dx = 2;
    this.dy = 2;
  }

  setDirection(direction) {
    this.dx = direction;
    this.dy = direction;
  }

  checkPaddleCollision(paddle) {
    // Check for collision between ball and paddle
    if (
      this.positionX + this.radius >= paddle.x - 5 &&
      this.positionX - this.radius <= paddle.x + paddle.width + 5 &&
      this.positionY + this.radius >= paddle.y - 15 &&
      this.positionY - this.radius <= paddle.y + paddle.height + 15
    ) {
      // Gradually incrementing speed
      if (Math.abs(this.dx) < this.maxSpeed) {
        this.dx += this.dx > 0 ? this.speedIncrement : -this.speedIncrement;
      }

      if (Math.abs(this.dy) < this.maxSpeed) {
        this.dy += this.dy > 0 ? this.speedIncrement : -this.speedIncrement;
      }

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

    return false;
  }

  // Using canvas API to create smooth game flow. Drawing a ball here.
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
