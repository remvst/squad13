class Bullet extends Entity {
    constructor(x, y, angle) {
        super();

        this.x = x;
        this.y = y;
        this.angle = angle;

        this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.35;
            sprite.rotation = this.angle;
            sprite.character = '-';
        });
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.x += Math.cos(this.angle) * 600 * elapsed;
        this.y += Math.sin(this.angle) * 600 * elapsed;

        for (const wall of this.world.bucket('wall')) {
            if (wall.pushAway(this, 15)) {
                wall.lastHit = wall.age;
                this.world.remove(this);
                return;
            }
        }

        this.world.add(new Particle({
            maxAge: 0.3,
            x: [this.x, this.x + rnd(-5, 5)],
            y: [this.y, this.y + rnd(-5, 5)],
            z: [0.35, 0.35],
            scaleX: [1, 0],
            scaleY: [1, 0],
            alpha: [1, 0],
            character: '.',
            rotation: this.angle,
        }));
    }
}
