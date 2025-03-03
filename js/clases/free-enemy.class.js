import Enemy from "./enemy.class.js";

class FreeEnemies extends Enemy {
  canMoveTo(x, y) {
    return (
      this.board.isValidPosition(x, y) &&
      (this.board.isFreeCell(x, y) || this.board.isTrailCell(x, y))
    );
  }

  collidesWithTrail(x, y) {
    return this.board.isTrailCell(x, y);
  }

  move() {
    if (!this.moving) {
      return;
    }

    const { nextX, nextY } = this.bounceIfNecessary();

    if (this.collidesWithTrail(nextX, nextY)) {
      this.onCollision();
      return;
    }

    this.x = nextX;
    this.y = nextY;
  }
}

export default FreeEnemies;
