class Transition extends Entity {

    constructor(direction) {
        super();
        this.direction = direction;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age > 0.3 && this.direction < 0) this.world.remove(this);
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        const shift = CANVAS_WIDTH * 0.1;
        let fromX = -CANVAS_WIDTH - shift;
        let toX = 0;
        if (this.direction < 0) {
            fromX = 0;
            toX = CANVAS_WIDTH + shift;
        }

        ctx.translate(interpolate(
            fromX,
            toX,
            this.age / 0.3
        ), 0);

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(CANVAS_WIDTH + shift, 0);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.lineTo(-shift, CANVAS_HEIGHT);
        ctx.fill();
    }
}
