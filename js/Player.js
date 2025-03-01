import RegionFiller from "./RegionFiller.js";

class Player {
  directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  constructor(x, y, tileSize, board, onGameOver, updateLives) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.board = board;
    this.direction = null;
    this.moving = false;
    this.wasOutside = false;
    this.lives = 3;
    this.lastSafeX = x;
    this.lastSafeY = y;
    this.regionFiller = new RegionFiller(board);
    this.onGameOver = onGameOver;
    this.updateLives = updateLives;

    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    if (this.directionMap[event.key]) {
      if (!this.moving) {
        this.wasOutside = false;
      }
      this.moving = true;
      this.direction = event.key;
    }
  }

  isInRestrictedArea() {
    return this.board.grid[this.y][this.x] === 1;
  }

  move() {
    if (!this.moving || !this.direction) return;

    const { x, y } = this.directionMap[this.direction];
    const nextX = this.x + x;
    const nextY = this.y + y;

    if (!this.canMoveTo(nextX, nextY)) {
      this.stopMovement();
      return;
    }

    if (this.collidesWithTrail(nextX, nextY)) {
      this.loseLife();
      return;
    }

    this.updatePosition(nextX, nextY);
  }

  canMoveTo(x, y) {
    return this.board.isValidPosition(x, y);
  }

  collidesWithTrail(x, y) {
    return this.board.grid[y][x] === 2;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;

    if (this.wasOutside && this.isInRestrictedArea()) {
      this.captureArea();
      return;
    }

    this.trackMovement();
  }

  captureArea() {
    this.regionFiller.fillSmallestZeroRegion();
    this.board.capturePath();
    this.stopMovement();
  }

  trackMovement() {
    if (!this.isInRestrictedArea()) {
      this.wasOutside = true;
      this.board.markPath(this.x, this.y);
    } else {
      this.lastSafeX = this.x;
      this.lastSafeY = this.y;
    }
  }

  stopMovement() {
    this.moving = false;
    this.direction = null;
  }

  loseLife() {
    this.lives -= 1;
    this.updateLives(this.lives);

    if (this.lives <= 0) {
      console.log("Game Over: Te has quedado sin vidas.");
      this.onGameOver();
      return;
    }

    console.log(`Perdiste una vida. Te quedan ${this.lives}`);

    this.board.clearPath();

    this.x = this.lastSafeX;
    this.y = this.lastSafeY;
    this.moving = false;
    this.direction = null;
  }

  update() {
    this.move();
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x * this.tileSize, this.y * this.tileSize, this.tileSize, this.tileSize);
  }
}

export default Player;
