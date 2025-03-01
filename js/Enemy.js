class Enemy {
  directionMap = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  constructor(x, y, tileSize, board) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.board = board;

    this.direction = this.getRandomDirection();
  }

  getRandomDirection() {
    return this.directionMap[Math.floor(Math.random() * this.directionMap.length)];
  }

  canMove(nextX, nextY) {
    return (
      nextX >= 0 &&
      nextX < this.board.cols &&
      nextY >= 0 &&
      nextY < this.board.rows &&
      (this.board.grid[nextY][nextX] === 0 || this.board.grid[nextY][nextX] === 2)
    );
  }

  getNextPosition() {
    return {
      x: this.x + this.direction.x,
      y: this.y + this.direction.y,
    };
  }

  bounceIfNecessary() {
    const nextX = this.x + this.direction.x;
    const nextY = this.y + this.direction.y;

    const hitWallX =
      nextX < 0 || nextX >= this.board.cols || this.board.grid[this.y]?.[nextX] === 1;
    const hitWallY =
      nextY < 0 || nextY >= this.board.rows || this.board.grid[nextY]?.[this.x] === 1;

    if (hitWallX && hitWallY) {
      this.direction.x *= -1;
      this.direction.y *= -1;
    } else {
      if (hitWallX) this.direction.x *= -1;
      if (hitWallY) this.direction.y *= -1;
    }

    const newNextX = this.x + this.direction.x;
    const newNextY = this.y + this.direction.y;

    if (this.canMove(newNextX, newNextY)) {
      this.x = newNextX;
      this.y = newNextY;
    } else {
      if (this.canMove(this.x + this.direction.x, this.y)) {
        this.x += this.direction.x;
      } else if (this.canMove(this.x, this.y + this.direction.y)) {
        this.y += this.direction.y;
      }
    }
  }

  isInRestrictedArea() {
    return this.board.grid[this.y][this.x] === 1;
  }

  move() {
    const { x: nextX, y: nextY } = this.getNextPosition();

    this.bounceIfNecessary(nextX, nextY);

    if (this.canMove(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    }
  }

  update() {
    this.move();
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x * this.tileSize, this.y * this.tileSize, this.tileSize, this.tileSize);
  }
}

export default Enemy;
