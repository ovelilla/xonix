import Game from "./Game.js";

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const loadingScreen = document.getElementById("loading-screen");
const progressBar = document.getElementById("progress-bar");
const gameScreen = document.getElementById("game-screen");
const canvasScreen = document.getElementById("canvas-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const restartButton = document.getElementById("restart-button");
const canvas = document.getElementById("canvas");

let game = null;

startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  // loadingScreen.classList.remove("hidden");

  gameScreen.classList.remove("hidden");
  canvas.classList.remove("hidden");

  // animateProgressBar(100, () => {
  //   console.log("progress bar finished");
  //   loadingScreen.classList.add("hidden");
  //   gameScreen.classList.remove("hidden");
  //   canvas.classList.remove("hidden");
  game = new Game(canvas, canvasScreen, handleGameOver);
  // game.reset();
  game.start();
  // });
});

function animateProgressBar(duration, callback) {
  let startTime = null;

  function updateProgressBar(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    progressBar.style.width = `${progress * 100}%`;

    if (progress < 1) {
      requestAnimationFrame(updateProgressBar);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(updateProgressBar);
}

function handleGameOver() {
  canvasScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}

restartButton.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  canvasScreen.classList.remove("hidden");
  game.reset();
  game.start();
});
