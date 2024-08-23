class Camera extends Entity {

    constructor() {
        super();
        this.buckets = ['camera'];

        this.minX = this.minY = this.maxX = this.maxY = 0;
    }

    cycle(elapsed) {
        const player = firstItem(this.world.bucket('player'));
        if (!player) return;

        const targetX = between(
            this.minX + CANVAS_WIDTH / 2,
            player.x + 500,
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
