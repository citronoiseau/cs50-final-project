// Class for ball object to have easy control on size, speed and position.
const INITIAL_VELOCITY = 250;
const VELOCITY_INCREASE = 15;

export default class Ball {
  constructor(direction, positionX, positionY, radius) {
    this.direction = direction;
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = radius;
    this.velocity = INITIAL_VELOCITY;
  }

  reset(canvas) {
    this.positionX = canvas.width / 2;
    this.positionY = canvas.height / 2;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  checkPaddleCollision(paddle) {
    if (
      this.positionX + this.radius >= paddle.x &&
      this.positionX - this.radius <= paddle.x + paddle.width &&
      this.positionY + this.radius >= paddle.y &&
      this.positionY - this.radius <= paddle.y + paddle.height
    ) {
      const relativeIntersectionY =
        paddle.y + paddle.height / 2 - this.positionY;

      const normalizedRelativeY = relativeIntersectionY / (paddle.height / 2);
      const bounceAngle = (normalizedRelativeY * Math.PI) / 4;
      this.direction = { x: Math.cos(bounceAngle), y: Math.sin(bounceAngle) };
      if (paddle.type === "right") {
        this.direction.x *= -1;
      }
    }
  }

  moveBall(canvas, player1, player2, delta) {
    this.positionX += this.direction.x * this.velocity * delta;
    this.positionY += this.direction.y * this.velocity * delta;

    this.velocity += VELOCITY_INCREASE * delta;

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
      this.direction.y *= -1;
    }

    // Check if ball collides with paddle
    this.checkPaddleCollision(player1.paddle);
    this.checkPaddleCollision(player2.paddle);

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

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
