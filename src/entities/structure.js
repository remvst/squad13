class Wall {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.length = dist(from, to);
        this.angle = angleBetween(from, to);
    }
}

class Structure extends Entity {
    constructor() {
        super();
        this.buckets.push('structure');


        this.walls = [];

        this.walls.push(new Wall({ x: 0, y: 0 }, { x: 0, y: 100 }));
        this.walls.push(new Wall({ x: 0, y: 0 }, { x: 200, y: 0 }));

        for (const wall of this.walls) {
            const shunks = wall.length / 20;

            for (let z = 0 ; z <= 1 ; z += 1 / 5) {
                for (let i = 0; i < shunks; i++) {
                    const x = interpolate(wall.from.x, wall.to.x, i / shunks);
                    const y = interpolate(wall.from.y, wall.to.y, i / shunks);

                    this.sprite(sprite => {
                        sprite.x = x;
                        sprite.y = y;
                        sprite.z = z;
                    });
                }
            }
        }
    }
}
