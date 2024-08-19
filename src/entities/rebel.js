class Rebel extends Entity {
    constructor() {
        super();
        this.buckets.push('human');
        this.radius = 10;
        this.lastShot = 0;
    }

    explode() {
        this.world.remove(this);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const player = firstItem(this.world.bucket('player'));
        if (player) {
            this.angle = angleBetween(this, player);

            if (this.age - this.lastShot > 4 && dist(player, this) < 500) {
                const missile = new Missile(this);
                missile.speed *= 0.5;
                this.world.add(missile);
                this.lastShot = this.age;
            }
        }

        for (const obstacle of this.world.bucket('obstacle')) {
            if (!isBetween(obstacle.minX - 100, this.x, obstacle.maxX + 100)) continue;
            obstacle.pushVertically(this);
        }

        this.y += elapsed * 100;
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.fillStyle = '#f00'
            ctx.fillRect(-5, -10, 10, 20);
            ctx.fillRect(-5, 10, 3, 4);
            ctx.fillRect(5, 10, -3, 4);

            ctx.wrap(() => {
                ctx.rotate(this.angle);

                ctx.fillStyle = '#000';
                ctx.fillRect(-10, -5, 20, 5);
            });
        })
    }
}
