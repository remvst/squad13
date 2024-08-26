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

        this.angle = PI;

        const player = firstItem(this.world.bucket('player'));
        if (player) {
            if (dist(player, this) < 500) {
                this.angle = angleBetween(this, player);

                if (this.age - this.lastShot > 4) {
                    const missile = new Missile(this);
                    missile.speed *= 0.5;
                    this.world.add(missile);
                    this.lastShot = this.age;
                }
            }
        }
    }

    render() {
        ctx.translate(this.x, this.y);

        ctx.fillStyle = ctx.strokeStyle = '#f00';
        ctx.scale(0.8, 0.8);

        // Head
        ctx.beginPath();
        ctx.arc(0, -12, 4, 0, PI * 2);
        ctx.fill();

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.lineWidth = 3;
        ctx.beginPath();

        ctx.wrap(() => {
            ctx.translate(0, -4);
            ctx.rotate(this.angle);
            ctx.moveTo(-8, 2);
        });
        ctx.lineTo(-5, -5);
        ctx.lineTo(5, -5);

        ctx.wrap(() => {
            ctx.translate(0, -4);
            ctx.rotate(this.angle);
            ctx.lineTo(8, 2);
        });
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(-3, 16);

        ctx.moveTo(3, 0);
        ctx.lineTo(3, 16);
        ctx.stroke();

        // ctx.fillStyle = '#00f';
        ctx.fillRect(-5, -8, 10, 16);

        ctx.wrap(() => {
            ctx.translate(0, -4);
            ctx.rotate(this.angle);

            ctx.fillStyle = '#000';
            ctx.fillRect(-14, -2.5, 24, 5);
        });
    }
}
