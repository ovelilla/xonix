class Renderer {
  cellColors = {
    0: "black",
    1: "DarkTurquoise",
    2: "DeepPink",
  };

  constructor(canvas, board, player, enemies, tileSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.board = board;
    this.player = player;
    this.enemies = enemies;
    this.tileSize = tileSize;
  }

  getCellColor(x, y) {
    return this.cellColors[this.board.getCellType(x, y)] || "black";
  }

  drawBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        this.drawCell(col, row);
      }
    }
  }

  drawCell(x, y) {
    this.ctx.fillStyle = this.getCellColor(x, y);
    this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
  }

  drawPlayer() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
      this.player.x * this.tileSize,
      this.player.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  drawEnemies() {
    this.ctx.fillStyle = "white";
    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(
        enemy.x * this.tileSize,
        enemy.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    });
  }

  draw() {
    this.drawBoard();
    this.drawPlayer();
    this.drawEnemies();
  }
}

export default Renderer;
