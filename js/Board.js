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
    if (this.isValidPosition(x, y) && this.grid[y][x] === 0) {
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

  getCellColor(row, col) {
    if (this.grid[row][col] === 1) return "DarkTurquoise";
    if (this.grid[row][col] === 2) return "DeepPink";
    return "black";
  }
  draw(ctx) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        ctx.fillStyle = this.getCellColor(row, col);
        ctx.fillRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }
}

export default Board;
