import Board from "./Board.js";
import CapturedEnemy from "./CapturedEnemy.js";
import FreeEnemy from "./FreeEnemy.js";
import Player from "./Player.js";
import RegionFiller from "./RegionFiller.js";
import Renderer from "./Renderer.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.tileSize = 10;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.rows = Math.floor(window.innerHeight / this.tileSize);
    this.cols = Math.floor(window.innerWidth / this.tileSize);

    this.board = new Board(this.rows, this.cols, this.tileSize);
    this.enemies = [
      new CapturedEnemy(0, 1, this.board, this.handleCollision.bind(this)),
      new FreeEnemy(10, 10, this.board, this.handleCollision.bind(this)),
      new FreeEnemy(30, 5, this.board, this.handleCollision.bind(this)),
      new FreeEnemy(5, 25, this.board, this.handleCollision.bind(this)),
    ];
    this.player = new Player(
      Math.round(this.board.cols / 2),
      0,
      this.board,
      this.handleCaptureArea.bind(this),
      this.handleCollision.bind(this)
    );
    this.renderer = new Renderer(canvas, this.board, this.player, this.enemies, 10);
    this.regionFiller = new RegionFiller(this.board, this.enemies);

    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.gameSpeed = 50;

    this.touchStartX = 0;
    this.touchStartY = 0;

    this.adjustCanvasSize();
    this.initEventListeners();
  }

  initEventListeners() {
    this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
    this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this), false);
    this.canvas.addEventListener("touchcancel", this.handleTouchEnd.bind(this), false);
  }

  handleTouchStart(event) {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  handleTouchMove(event) {
    if (event.touches.length === 1) {
      const touchEndX = event.touches[0].clientX;
      const touchEndY = event.touches[0].clientY;

      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimiento horizontal
        this.direction = deltaX > 0 ? "right" : "left";
      } else {
        // Movimiento vertical
        this.direction = deltaY > 0 ? "down" : "up";
      }

      if (!this.paused) {
        this.wasOutside = false;
        this.moving = true;
      }
    }
  }

  handleTouchEnd(event) {
    // Opcional: Puedes resetear alguna variable si es necesario al finalizar el toque.
  }

  start() {
    this.running = true;
    this.loop(performance.now());
  }

  adjustCanvasSize() {
    this.canvas.width = this.cols * this.tileSize;
    this.canvas.height = this.rows * this.tileSize;
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
      this.renderer.draw();
      this.accumulator -= this.gameSpeed;
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    this.player.update();
    this.enemies.forEach((enemy) => enemy.update());
    this.checkCollisions();
  }

  async checkCollisions() {
    this.enemies.forEach(async (enemy) => {
      const px = this.player.x;
      const py = this.player.y;

      const ex = enemy.x;
      const ey = enemy.y;

      const nextEx = ex + enemy.direction.x;
      const nextEy = ey + enemy.direction.y;

      // if (
      //   (this.board.isFreeCell(ex, ey) && this.board.isCapturedCell(nextEx, nextEy)) ||
      //   (this.board.isCapturedCell(ex, ey) && this.board.isFreeCell(nextEx, nextEy))
      // ) {
      //   return;
      // }

      const next = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      const willCollide = next.some(({ x, y }) => ex + x === px && ey + y === py);

      if (!this.player.paused && willCollide) {
        this.handleCollision();
      }
    });
  }

  async handleCollision() {
    this.player.loseLife();

    if (this.player.lives === 0) {
      this.gameOver();
      return;
    }

    this.player.pause();
    this.player.stopMovement();
    this.enemies.forEach((enemy) => enemy.stopMovement());
    await this.sleep(3000);
    this.player.resetInitialPosition();
    this.enemies.forEach((enemy) => enemy.resetInitialPosition && enemy.resetInitialPosition());
    this.player.resume();
    this.enemies.forEach((enemy) => enemy.resumeMovement());
    this.board.clearPath();
  }

  handleCaptureArea() {
    this.regionFiller.fillCapturedRegions();
    this.board.capturePath();
  }

  gameOver() {
    this.running = false;
    // alert("Game Over: Te has quedado sin vidas.");
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default Game;
