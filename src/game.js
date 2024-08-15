class Game {
    constructor() {
        this.world = new World();

        this.createMap();

        this.world.add(new Player());
        this.world.add(new Floor());

        const enemy = new Enemy();
        enemy.x = 200;
        enemy.y = 200;
        this.world.add(enemy);

        const topLeft = { x: 0, y: 0 };
        const topRight = { x: 200, y: 0 };
        const bottomLeft = { x: 0, y: 200 };
        const bottomRight = { x: 200, y: 200 };
        const doorTop = { x: 200, y: 100 };
        const doorBottom = { x: 200, y: 150 };
        this.world.add(new Wall(topLeft, topRight, FULL_WALL));
        this.world.add(new Wall(topLeft, bottomLeft, FULL_WALL));
        this.world.add(new Wall(bottomLeft, bottomRight, FULL_WALL));
        this.world.add(new Wall(topRight, doorTop, FULL_WALL));
        this.world.add(new Wall(doorTop, doorBottom, DOOR_TOP));
        this.world.add(new Wall(doorBottom, bottomRight, FULL_WALL));
    }

    cycle(elapsed) {
        this.world.cycle(elapsed);
        this.world.prepareSprites();
        this.world.render();

        if (DEBUG) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.font = '14pt Courier';
            ctx.lineWidth = 3;

            let y = CANVAS_HEIGHT - 10;
            for (const line of [
                'FPS: ' + ~~(1 / elapsed),
                'Entities: ' + this.world.entities.size,
            ].reverse()) {
                ctx.strokeText(line, 10, y);
                ctx.fillText(line, 10, y);
                y -= 20;
            }
        }
    }

    createMap() {
        const generator = new MapGenerator();
        for (const wall of generator.walls) {
            this.world.add(wall);
        }
    }
}
