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
    this.paused = false;
    this.pauseStartTime = 0;
    this.totalPauseDuration = 0;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  update() {
    if (this.paused) return;

    const now = performance.now();
    this.elapsedTime = (now - this.startTime - this.totalPauseDuration) / 1000;
    this.timeContainer.textContent = this.formatTime(this.elapsedTime);

    this.scoreContainer.textContent = this.board.getScore();
    this.progressContainer.textContent = `${this.board.getProgress()}%`;
    this.livesContainer.textContent = this.player.lives;
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.pauseStartTime = performance.now();
    }
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      this.totalPauseDuration += performance.now() - this.pauseStartTime;
    }
  }

  reset() {
    this.startTime = performance.now();
    this.elapsedTime = 0;
    this.paused = false;
    this.pauseStartTime = 0;
    this.totalPauseDuration = 0;

    this.timeContainer.textContent = this.formatTime(0);

    this.scoreContainer.textContent = this.board.getScore();
    this.progressContainer.textContent = `${this.board.getProgress()}%`;
  }
}

export default Stats;
