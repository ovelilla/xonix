class Player {
  directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  constructor(x, y, tileSize, board, onGameOver, onLoseLife, onCaptureArea) {
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
    this.onGameOver = onGameOver;
    this.onLoseLife = onLoseLife;
    this.onCaptureArea = onCaptureArea;

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
    return this.board.isTrail(x, y);
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;

    if (this.wasOutside && this.board.isCapturedArea(x, y)) {
      this.captureArea();
      return;
    }

    this.trackMovement();
  }

  captureArea() {
    this.onCaptureArea();
    this.stopMovement();
  }

  trackMovement() {
    if (!this.board.isCapturedArea(this.x, this.y)) {
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
    this.onLoseLife(this.lives);

    if (this.lives <= 0) {
      this.onGameOver();
      return;
    }

    this.board.clearPath();

    this.x = this.lastSafeX;
    this.y = this.lastSafeY;

    this.stopMovement();
  }

  update() {
    this.move();
  }
}

export default Player;
