class Camera extends Entity {

    constructor() {
        super();
        this.buckets = ['camera'];

        this.minX = this.minY = this.maxX = this.maxY = 0;
        this.shakeEnd = 0;
        this.nextShake = 0;
        this.shakePower = 1;
    }

    shake(power) {
        this.shakePower = power;
        this.shakeEnd = this.age + 0.4;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const player = firstItem(this.world.bucket('player'));
        if (!player) return;

        this.nextShake -= elapsed;
        if (this.age < this.shakeEnd) {
            if (this.nextShake <= 0) {
                this.nextShake = 1 / 60;
                this.x += rnd(-this.shakePower, this.shakePower) * 20;
                this.y += rnd(-this.shakePower, this.shakePower) * 20;
            }
        }

        const targetX = between(
            this.minX + CANVAS_WIDTH / 2,
            player.x + CANVAS_WIDTH / 4,
            this.maxX - CANVAS_WIDTH / 2,
        );

        const targetY = between(
            this.minY + CANVAS_HEIGHT / 2,
            player.y,
            this.maxY - CANVAS_HEIGHT / 2,
        );

        const diffX = Math.abs(targetX - this.x);
        const diffY = Math.abs(targetY - this.y);
        const velX = diffX / 0.5;
        const velY = diffY / 0.5;

        this.x += between(
            -elapsed * velX,
            targetX - this.x,
            elapsed * velX,
        );
        this.y += between(
            -elapsed * velY,
            targetY - this.y,
            elapsed * velY,
        );

        this.x = between(
            this.minX + CANVAS_WIDTH / 2,
            this.x,
            this.maxX - CANVAS_WIDTH / 2,
        );

        this.y = between(
            this.minY + CANVAS_HEIGHT / 2,
            this.y,
            this.maxY - CANVAS_HEIGHT / 2,
        );
    }
}
