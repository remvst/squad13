class Camera extends Entity {

    constructor() {
        super();
        this.zoom = 1;
        this.buckets = ['camera'];
    }

    cycle(elapsed) {
        const player = firstItem(this.world.bucket('player'));
        if (!player) return;

        const diffX = Math.abs(player.x - this.x);
        const diffY = Math.abs(player.y - this.y);
        const velX = diffX / 0.8;
        const velY = diffY / 0.8;

        this.x += between(
            -elapsed * velX,
            player.x - this.x,
            elapsed * velX,
        );
        this.y += between(
            -elapsed * velY,
            player.y - this.y,
            elapsed * velY,
        );
    }
}
