class Rebel extends Human {
    constructor() {
        super();
        this.buckets.push('rebel');
        this.lastShot = 0;
        this.shotInterval = 6;
        this.aimLockRatio = 0;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.angle = PI;

        const player = firstItem(this.world.bucket('player'));
        if (player && dist(player, this) < 500) {
            this.angle = angleBetween(this, player);

            const x = this.x + cos(this.angle) * 30;
            const y = this.y + sin(this.angle) * 30;

            let obstacle = null;
            for (const candidate of this.world.bucket('obstacle')) {
                if (candidate.directionY < 0) continue;
                if (!isBetween(candidate.minX, this.x, candidate.maxX)) continue;
                obstacle = candidate;
            }

            if (obstacle && obstacle.contains(x, y)) {
                this.aimLockRatio = 0;
                return;
            }

            if (this.age - this.lastShot > this.shotInterval) {
                if (this.aimLockRatio === 0) {
                    sound(...[1.7,,391,.01,.12,.08,,3.4,18,-9,,,.02,.7,,,.13,.71,.1,.02]); // Shoot 767
                }
                this.aimLockRatio += elapsed * 2;
            }

            if (this.aimLockRatio >= 1) {
                const missile = new Missile(this);
                missile.speed *= 0.5;
                this.world.add(missile);
                this.lastShot = this.age;

                this.aimLockRatio = 0;
            }
        } else {
            this.aimLockRatio = 0;
        }
    }

    render() {
        ctx.translate(this.x, this.y);

        ctx.wrap(() => {
            if (this.aimLockRatio <= 0) return;

            ctx.fillStyle = '#ff0';
            ctx.globalAlpha = interpolate(0, 0.5, this.aimLockRatio);
            const s = interpolate(1, 0, this.aimLockRatio);
            ctx.scale(s, s);
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, PI * 2);
            ctx.fill();
        })

        ctx.fillStyle = ctx.strokeStyle = '#000';
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

            ctx.fillStyle = '#f00';
            ctx.fillRect(-10, -2.5, 24, 5);
        });
    }
}
