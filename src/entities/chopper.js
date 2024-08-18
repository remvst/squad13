class Hitbox {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

class Chopper extends Entity {

    constructor() {
        super();
        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false,
        };

        this.hitBoxes = [
            new Hitbox(-10, 10, 5),
            new Hitbox(10, 10, 5),
            new Hitbox(10, -10, 5),
            new Hitbox(-10, -10, 5),
        ];

        this.globalHitBoxes = [];
    }

    updateGlobalHitboxes() {
        for (let i = 0 ; i < this.hitBoxes.length ; i++) {
            if (!this.globalHitBoxes[i]) {
                this.globalHitBoxes[i] = new Hitbox(0, 0, 0);
            }

            const hitBox = this.hitBoxes[i];
            const hitBoxAngle = Math.atan2(hitBox.y, hitBox.x);
            const dist = distP(0, 0, hitBox.x, hitBox.y);
            this.globalHitBoxes[i].x = this.x + Math.cos(this.angle + hitBoxAngle) * dist;
            this.globalHitBoxes[i].y = this.y + Math.sin(this.angle + hitBoxAngle) * dist;
            this.globalHitBoxes[i].radius = hitBox.radius;
        }
    }

    get averagePoint() {
        let x = 0, y = 0;
        for (const hitBox of this.globalHitBoxes) {
            x += hitBox.x;
            y += hitBox.y;
        }
        return {
            x: x / this.hitBoxes.length,
            y: y / this.hitBoxes.length,
        };
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        let x = 0, y = 0;
        if (this.controls.left) x -= 1;
        if (this.controls.right) x += 1;
        if (this.controls.up) y -= 1;
        if (this.controls.down) y += 1;

        this.x += elapsed * x * 100;
        this.y += elapsed * y * 100;

        this.updateGlobalHitboxes();

        const { averagePoint } = this;

        for (const obstacle of this.world.bucket('obstacle')) {
            for (const hitBox of this.globalHitBoxes) {
                obstacle.pushAway(hitBox);
            }
        }

        const newAverage = this.averagePoint;

        const dX = newAverage.x - averagePoint.x;
        const dY = newAverage.y - averagePoint.y;

        if (dX || dY) {
            this.x += dX;
            this.y += dY;

            const angleOriginal = atan2(averagePoint.y, averagePoint.x);
            const angleNew = atan2(newAverage.y, newAverage.x);

            this.angle += angleOriginal - angleNew;
        }
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillStyle = '#f00';
            ctx.fillRect(-20, -10, 40, 20);
        });

        ctx.fillStyle = '#0f0';
        for (const hitBox of this.globalHitBoxes) {
            ctx.beginPath();
            ctx.arc(hitBox.x, hitBox.y, hitBox.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        const { averagePoint } = this;
        ctx.fillStyle = '#00f';
        ctx.fillRect(averagePoint.x - 2, averagePoint.y - 2, 4, 4);
    }
}
