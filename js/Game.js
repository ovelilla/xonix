import Board from "./Board.js";
import Player from "./Player.js";
import Enemy from "./Enemy.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.board = new Board(40, 80, 10);
    this.player = new Player(
      1,
      1,
      10,
      this.board,
      this.handleGameOver.bind(this),
      this.updateLives.bind(this)
    );

    this.enemies = [
      new Enemy(10, 10, 10, this.board),
      new Enemy(30, 5, 10, this.board),
      new Enemy(5, 25, 10, this.board),
    ];

    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.gameSpeed = 50;

    this.adjustCanvasSize();
    this.displayLives(3);
  }

  start() {
    this.running = true;
    this.loop(performance.now());
  }

  adjustCanvasSize() {
    this.canvas.width = this.board.cols * this.board.tileSize;
    this.canvas.height = this.board.rows * this.board.tileSize;
  }

  loop(timestamp) {
    if (!this.running) {
      return;
    }

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.gameSpeed) {
      this.update();
      this.accumulator -= this.gameSpeed;
    }

    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    this.player.update();
    this.enemies.forEach((enemy) => enemy.update());
  }

  handleGameOver() {
    this.running = false;
    alert("Game Over: Te has quedado sin vidas.");
  }

  updateLives(lives) {
    this.displayLives(lives);
  }

  displayLives(lives) {
    console.log("Lives:", lives);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.board.draw(this.ctx);
    this.player.draw(this.ctx);
    this.enemies.forEach((enemy) => enemy.draw(this.ctx));
  }
}

export default Game;