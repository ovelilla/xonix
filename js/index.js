import Game from "./Game.js";

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const loadingScreen = document.getElementById("loading-screen");
const difficultyScreen = document.getElementById("difficulty-screen");
const difficultySelect = document.getElementById("difficulty-select");
const confirmDifficultyButton = document.getElementById("confirm-difficulty-button");
const progressBar = document.getElementById("progress-bar");
const gameScreen = document.getElementById("game-screen");
const canvasScreen = document.getElementById("canvas-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const restartButton = document.getElementById("restart-button");
const canvas = document.getElementById("canvas");

const difficultyLevels = {
  1: { gameSpeed: 80, capturedEnemies: 1, freeEnemies: 2 },
  2: { gameSpeed: 75, capturedEnemies: 1, freeEnemies: 2 },
  3: { gameSpeed: 70, capturedEnemies: 1, freeEnemies: 3 },
  4: { gameSpeed: 65, capturedEnemies: 1, freeEnemies: 3 },
  5: { gameSpeed: 60, capturedEnemies: 1, freeEnemies: 4 },
  6: { gameSpeed: 55, capturedEnemies: 1, freeEnemies: 4 },
  7: { gameSpeed: 50, capturedEnemies: 2, freeEnemies: 5 },
  8: { gameSpeed: 45, capturedEnemies: 2, freeEnemies: 5 },
  9: { gameSpeed: 40, capturedEnemies: 2, freeEnemies: 6 },
  10: { gameSpeed: 40, capturedEnemies: 3, freeEnemies: 6 },
};

let game = null;

startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  loadingScreen.classList.remove("hidden");

  animateProgressBar(1000, () => {
    loadingScreen.classList.add("hidden");
    difficultyScreen.classList.remove("hidden");
  });
});

confirmDifficultyButton.addEventListener("click", () => {
  difficultyScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  canvas.classList.remove("hidden");

  const selectedLevel = parseInt(difficultySelect.value);
  const config = difficultyLevels[selectedLevel];

  game = new Game(canvas, canvasScreen, handleGameOver, config);
  game.start();
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
