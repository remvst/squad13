const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 40;

class MapGenerator {
    constructor() {
        this.grid = [];
        for (let row = 0 ; row < ROWS ; row++) {
            this.grid[row] = [];
            for (let col = 0 ; col < COLS ; col++) {
                this.grid[row][col] = false;
            }
        }

        for (let i = 0 ; i < 5 ; i++)  {
            this.addRoom(5, 5);
        }

        this.walls = [];

        console.log('HAHA');

        this.walls.push(new Wall({x: 0, y: 0}, {x: COLS * CELL_SIZE, y: 0}, FULL_WALL));
        this.walls.push(new Wall({x: 0, y: ROWS * CELL_SIZE}, {x: COLS * CELL_SIZE, y: ROWS * CELL_SIZE}, FULL_WALL));
        this.walls.push(new Wall({x: 0, y: 0}, {x: 0, y: ROWS * CELL_SIZE}, FULL_WALL));
        this.walls.push(new Wall({x: COLS *CELL_SIZE, y: 0}, {x: COLS *CELL_SIZE, y: ROWS * CELL_SIZE}, FULL_WALL));

        return;

        for (let row = 0 ; row < ROWS - 1 ; row++) {
            let wallStartCol = -1;
            for (let col = 0 ; col < COLS ; col++) {
                const current = this.grid[row][col];
                const under = this.grid[row + 1][col];
                if (under === current) {
                    if (wallStartCol >= 0) {
                        const wallEndCol = col;

                        this.walls.push(new Wall(
                            { x: wallStartCol * CELL_SIZE, y: row * CELL_SIZE },
                            { x: wallEndCol * CELL_SIZE, y: row * CELL_SIZE },
                            FULL_WALL,
                        ));
                    }

                    wallStartCol = -1;
                } else {
                    if (wallStartCol < 0) {
                        wallStartCol = col;
                    }
                }
            }
        }

        for (let col = 0 ; col < COLS - 1 ; col++) {
            let wallStartRow = -1;
            for (let row = 0 ; row < ROWS ; row++) {
                const current = this.grid[row][col];
                const right = this.grid[row][col + 1];
                if (right === current) {
                    if (wallStartRow >= 0) {
                        const wallEndRow = col;

                        this.walls.push(new Wall(
                            { x: col * CELL_SIZE, y: wallStartRow * CELL_SIZE },
                            { x: col * CELL_SIZE, y: wallEndRow * CELL_SIZE },
                            FULL_WALL,
                        ));
                    }

                    wallStartRow = -1;
                } else {
                    if (wallStartRow < 0) {
                        wallStartRow = row;
                    }
                }
            }
        }
    }

    addRoom(roomRows, roomCols) {
        const rowStart = ~~rnd(1, ROWS - roomRows - 1);
        const colStart = ~~rnd(1, COLS - roomCols - 1);

        for (let row = rowStart ; row < rowStart + roomRows ; row++) {
            for (let col = colStart ; col < colStart + roomCols ; col++) {
                this.grid[row][col] = true;
            }
        }
    }
}
