class Player {
  directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  constructor(x, y, board, onCaptureArea, onCollision) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.board = board;
    this.direction = null;
    this.moving = false;
    this.wasOutside = false;
    this.lives = 3;
    this.onCaptureArea = onCaptureArea;
    this.onCollision = onCollision;
    this.paused = false;

    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    if (this.directionMap[event.key]) {
      if (this.paused) {
        return;
      }
      this.moving = true;
      this.direction = event.key;
    }
  }
  update() {
    this.move();
  }

  move() {
    if (!this.moving || !this.direction) {
      return;
    }

    const { x, y } = this.directionMap[this.direction];

    const nextX = this.x + x;
    const nextY = this.y + y;

    if (!this.canMoveTo(nextX, nextY)) {
      this.stopMovement();
      return;
    }

    if (this.collidesWithTrail(nextX, nextY)) {
      this.onCollision();
      return;
    }

    this.updatePosition(nextX, nextY);
  }

  canMoveTo(x, y) {
    return this.board.isValidPosition(x, y);
  }

  stopMovement() {
    this.moving = false;
    this.direction = null;
  }

  collidesWithTrail(x, y) {
    return this.board.isTrailCell(x, y);
  }

  loseLife() {
    this.lives -= 1;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;

    if (this.wasOutside && this.board.isCapturedCell(x, y)) {
      this.captureArea();
      this.wasOutside = false;
      return;
    }

    this.trackMovement();
  }

  captureArea() {
    this.onCaptureArea();
    this.stopMovement();
  }

  trackMovement() {
    if (!this.board.isCapturedCell(this.x, this.y)) {
      this.wasOutside = true;
      this.board.markPath(this.x, this.y);
    }
  }

  resetInitialPosition() {
    this.wasOutside = false;
    this.x = this.initialX;
    this.y = this.initialY;
  }

  getNextCell() {
    return {
      x: this.x + this.direction.x,
      y: this.y + this.direction.y,
    };
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  reset() {
    this.lives = 3;
    this.moving = false;
    this.paused = false;
    this.wasOutside = false;
    this.x = this.initialX;
    this.y = this.initialY;
  }
}

export default Player;
