class TouchControls {
  constructor(canvas, player) {
    this.canvas = canvas;
    this.player = player;

    this.initEventListeners();
  }

  initEventListeners() {
    this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false });
  }

  handleTouchStart(event) {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  handleTouchMove(event) {
    event.preventDefault();

    if (!event.touches.length === 1 || this.player.paused) {
      return;
    }

    this.player.wasOutside = false;
    this.player.moving = true;
    this.player.direction = event.key;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.player.direction = deltaX > 0 ? "ArrowRight" : "ArrowLeft";
    } else {
      this.player.direction = deltaY > 0 ? "ArrowDown" : "ArrowUp";
    }
  }
}

export default TouchControls;
