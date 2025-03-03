import CapturedEnemies from "./captured-enemy.class.js";
import FreeEnemies from "./free-enemy.class.js";

class Renderer {
  cellColors = {
    0: "transparent",
    1: "#ffffff80",
    2: "#2decc7",
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
    const padding = 3;
    const size = this.tileSize - padding * 2;

    this.ctx.strokeStyle = "#2decc7";
    this.ctx.lineWidth = padding;
    this.ctx.strokeRect(
      this.player.x * this.tileSize + padding,
      this.player.y * this.tileSize + padding,
      size,
      size
    );

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(
      this.player.x * this.tileSize + padding,
      this.player.y * this.tileSize + padding,
      size,
      size
    );
  }

  drawEnemies() {
    const padding = 3;
    const size = this.tileSize - padding * 2;

    this.enemies.forEach((enemy) => {
      if (enemy instanceof CapturedEnemies) {
        this.ctx.strokeStyle = "#ffffff";
      } else if (enemy instanceof FreeEnemies) {
        this.ctx.strokeStyle = "#ff00ff";
      }

      this.ctx.lineWidth = padding;
      this.ctx.strokeRect(
        enemy.x * this.tileSize + padding,
        enemy.y * this.tileSize + padding,
        size,
        size
      );

      if (enemy instanceof CapturedEnemies) {
        this.ctx.fillStyle = "#ff00ff";
      } else if (enemy instanceof FreeEnemies) {
        this.ctx.fillStyle = "#ffffff";
      }
      this.ctx.fillRect(
        enemy.x * this.tileSize + padding,
        enemy.y * this.tileSize + padding,
        size,
        size
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
