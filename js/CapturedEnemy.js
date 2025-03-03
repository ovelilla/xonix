import Enemy from "./Enemy.js";

class CapturedEnemies extends Enemy {
  canMoveTo(x, y) {
    return this.board.isValidPosition(x, y) && this.board.isCapturedCell(x, y);
  }
}

export default CapturedEnemies;
