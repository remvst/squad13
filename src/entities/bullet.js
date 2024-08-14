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
                this.world.remove(this);
                break;
            }
        }
    }
}
