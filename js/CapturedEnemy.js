import Enemy from "./Enemy.js";

class CapturedEnemies extends Enemy {
  canMoveTo(x, y) {
    return this.board.isValidPosition(x, y) && this.board.isCapturedCell(x, y);
  }

  resetInitialPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
  }
}

export default CapturedEnemies;
