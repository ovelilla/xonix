class Stats {
  constructor(board, player) {
    this.board = board;
    this.player = player;

    this.scoreContainer = document.getElementById("score");
    this.progressContainer = document.getElementById("progress");
    this.livesContainer = document.getElementById("lives");
    this.timeContainer = document.getElementById("time");

    this.startTime = performance.now();
    this.elapsedTime = 0;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  update() {
    this.scoreContainer.textContent = this.board.getScore();

    this.progressContainer.textContent = `${this.board.getProgress()}%`;

    this.livesContainer.textContent = this.player.lives;

    const now = performance.now();
    this.elapsedTime = (now - this.startTime) / 1000;
    this.timeContainer.textContent = this.formatTime(this.elapsedTime);
  }
}

export default Stats;
