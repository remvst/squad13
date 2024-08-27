const SHIFT = 160;

class Transition extends Entity {

    constructor(fromX, toX) {
        super();
        this.fromX = fromX;
        this.toX = toX;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age > 0.3 && this.direction < 0) this.world.remove(this);
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.translate(interpolate(
            this.fromX,
            this.toX,
            this.age / 0.3
        ), 0);

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(CANVAS_WIDTH + SHIFT, 0);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.lineTo(-SHIFT, CANVAS_HEIGHT);
        ctx.fill();
    }
}

class TransitionIn extends Transition {
    constructor() {
        super(0, CANVAS_WIDTH + SHIFT);
    }
}

class TransitionOut extends Transition {
    constructor() {
        super(-CANVAS_WIDTH - SHIFT, 0);
    }
}
