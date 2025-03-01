import Board from "./Board.js";
import Enemy from "./Enemy.js";
import Player from "./Player.js";
import RegionFiller from "./RegionFiller.js";
import Renderer from "./Renderer.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.board = new Board(40, 80, 10);
    this.enemies = [
      new Enemy(10, 10, 10, this.board),
      new Enemy(30, 5, 10, this.board),
      new Enemy(5, 25, 10, this.board),
    ];
    this.player = new Player(
      1,
      1,
      10,
      this.board,
      this.handleGameOver.bind(this),
      this.handleLoseLife.bind(this),
      this.handleCaptureArea.bind(this)
    );
    this.renderer = new Renderer(canvas, this.board, this.player, this.enemies, 10);
    this.regionFiller = new RegionFiller(this.board, this.enemies);

    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.gameSpeed = 50;

    this.adjustCanvasSize();
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

    this.renderer.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    this.player.update();
    this.enemies.forEach((enemy) => enemy.update());
    this.checkCollisions();
  }

  checkCollisions() {
    this.enemies.forEach((enemy) => {
      if (this.player.x === enemy.x && this.player.y === enemy.y) {
        console.log("Colisión detectada entre Player y Enemy");
        this.player.loseLife();
      }

      if (this.board.isTrail(enemy.x, enemy.y)) {
        console.log("Colisión detectada entre Enemy y rastro del Player");
        this.player.loseLife();
        this.board.clearPath();
        // this.player.reset();
      }
    });
  }

  handleCaptureArea() {
    this.regionFiller.fillCapturedRegions();
    this.board.capturePath();
  }

  handleLoseLife(lives) {
    console.log(`Perdiste una vida. Te quedan ${lives}`);
  }

  handleGameOver() {
    this.running = false;
    alert("Game Over: Te has quedado sin vidas.");
  }
}

export default Game;
