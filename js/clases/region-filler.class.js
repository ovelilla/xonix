class RegionFiller {
  constructor(board, enemies) {
    this.board = board;
    this.enemies = enemies;
    this.regions = [];
    this.visited = new Set();
  }

  fillCapturedRegions() {
    this.regions = this.findZeroRegions();

    if (this.regions.length <= 1) {
      return;
    }

    const enemyRegions = this.findRegionsWithEnemies();

    this.fillRegionsExcept(enemyRegions);
  }

  findZeroRegions() {
    this.visited.clear();
    const foundRegions = [];

    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        if (this.board.grid[row][col] === 0 && !this.visited.has(`${row},${col}`)) {
          foundRegions.push(this.bfs(row, col));
        }
      }
    }

    return foundRegions;
  }

  findRegionsWithEnemies() {
    return this.regions.filter((region) =>
      region.some(({ row, col }) =>
        this.enemies.some((enemy) => enemy.x === col && enemy.y === row)
      )
    );
  }

  fillRegionsExcept(enemyRegions) {
    this.regions.forEach((region) => {
      if (!enemyRegions.includes(region)) {
        region.forEach(({ row, col }) => {
          this.board.grid[row][col] = 1;
        });
      }
    });
  }

  bfs(startRow, startCol) {
    const queue = [{ row: startRow, col: startCol }];
    const region = [];

    this.visited.add(`${startRow},${startCol}`);
    let index = 0;

    while (index < queue.length) {
      const { row, col } = queue[index++];
      region.push({ row, col });

      for (const { x, y } of [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
      ]) {
        const newRow = row + x;
        const newCol = col + y;
        const key = `${newRow},${newCol}`;

        if (
          newRow >= 0 &&
          newRow < this.board.rows &&
          newCol >= 0 &&
          newCol < this.board.cols &&
          this.board.grid[newRow][newCol] === 0 &&
          !this.visited.has(key)
        ) {
          this.visited.add(key);
          queue.push({ row: newRow, col: newCol });
        }
      }
    }

    return region;
  }
}

export default RegionFiller;
