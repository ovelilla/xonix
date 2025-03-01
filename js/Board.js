class Board {
  constructor(rows, cols, tileSize) {
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.grid = this.createBoard();
  }

  createBoard() {
    return Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) => (this.isBorderCell(row, col) ? 1 : 0))
    );
  }

  isBorderCell(row, col) {
    return row < 2 || row >= this.rows - 2 || col < 2 || col >= this.cols - 2;
  }

  markCell(x, y) {
    if (this.isValidPosition(x, y)) {
      this.grid[y][x] = 1;
    }
  }

  markPath(x, y) {
    if (this.isValidPosition(x, y) && this.getCellType(x, y) === 0) {
      this.grid[y][x] = 2;
    }
  }

  capturePath() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === 2) {
          this.grid[row][col] = 1;
        }
      }
    }
  }

  clearPath() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === 2) {
          this.grid[row][col] = 0;
        }
      }
    }
  }

  isValidPosition(x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }

  getCellType(x, y) {
    if (!this.isValidPosition(x, y)) {
      return null;
    }
    return this.grid[y][x];
  }

  isFreeCell(x, y) {
    return this.getCellType(x, y) === 0;
  }

  isCapturedCell(x, y) {
    return this.getCellType(x, y) === 1;
  }

  isTrailCell(x, y) {
    return this.getCellType(x, y) === 2;
  }
}

export default Board;
