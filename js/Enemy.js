class Enemy {
  directionMap = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  constructor(x, y, board, onCollision) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.board = board;
    this.direction = this.getRandomDirection();
    this.moving = true;
    this.onCollision = onCollision;
  }

  resumeMovement() {
    this.moving = true;
  }

  getRandomDirection() {
    return this.directionMap[Math.floor(Math.random() * this.directionMap.length)];
  }

  getNextPosition() {
    return {
      x: this.x + this.direction.x,
      y: this.y + this.direction.y,
    };
  }

  bounceIfNecessary() {
    let nextX = this.x + this.direction.x;
    let nextY = this.y + this.direction.y;

    let hitX = !this.canMoveTo(nextX, this.y);
    let hitY = !this.canMoveTo(this.x, nextY);

    if (hitX) {
      this.direction.x *= -1;
      nextX = this.x + this.direction.x;
    }

    if (hitY) {
      this.direction.y *= -1;
      nextY = this.y + this.direction.y;
    }

    return { nextX, nextY };
  }

  update() {
    this.move();
  }

  move() {
    if (!this.moving) {
      return;
    }

    const { nextX, nextY } = this.bounceIfNecessary();

    this.x = nextX;
    this.y = nextY;
  }

  stopMovement() {
    this.moving = false;
  }

  resetInitialPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.direction = this.getRandomDirection();
  }

  reset() {
    this.resetInitialPosition();
  }
}

export default Enemy;
