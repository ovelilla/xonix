class RegionFiller {
  constructor(board) {
    this.board = board;
  }

  fillSmallestZeroRegion() {
    const regions = this.findZeroRegions();
    if (regions.length === 0) return;

    const smallestRegion = regions.reduce((smallest, current) =>
      current.length < smallest.length ? current : smallest
    );

    smallestRegion.forEach(({ row, col }) => {
      this.board.grid[row][col] = 1;
    });

    this.board.markPath(this.x, this.y);
  }

  findZeroRegions() {
    const visited = new Set();
    const regions = [];

    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        if (this.board.grid[row][col] === 0 && !visited.has(`${row},${col}`)) {
          regions.push(this.bfs(row, col, visited));
        }
      }
    }
    return regions;
  }

  bfs(startRow, startCol, visited) {
    const queue = [{ row: startRow, col: startCol }];
    const region = [];

    visited.add(`${startRow},${startCol}`);
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
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push({ row: newRow, col: newCol });
        }
      }
    }

    return region;
  }
}

export default RegionFiller;
