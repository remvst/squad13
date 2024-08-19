class Game {
    constructor() {
        this.world = new World();

        const camera = firstItem(this.world.bucket('camera'));
        camera.minX = -300;
        camera.maxX = 5000;
        camera.minY = -500;
        camera.maxY = 500;

        const bg = new Background('#f22f00', '#fa7f02');
        this.world.add(bg);

        this.world.add(Obstacle.landingObstacle(0, 100, 200));
        // this.world.add(Obstacle.mountain(300, 2000, -200, 200, 1));
        // this.world.add(Obstacle.landingObstacle(2500, 100, 200));

        const ceiling = new Obstacle();
        ceiling.directionY = -1;
        for (let x = 0 ; x < 800 ; x+= 100)  {
            ceiling.points.push({x: x + 200, y: sin(x / 800 * PI * 2 * 3) * 40 - 400});
        }
        this.world.add(ceiling);

        this.world.add(new Player());

        const water = new Water();
        water.y = 400;
        this.world.add(water);
    }

    cycle(elapsed) {
        this.world.cycle(elapsed);
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
}
