class Stars extends Entity {

    constructor() {
        super();
        this.rng = new RNG();
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.fillStyle = 'white';

        this.rng.reset();
        for (let i = 0 ; i < 100 ; i++)  {
            ctx.fillRect(
                this.rng.next(0, CANVAS_WIDTH),
                this.rng.next(0, CANVAS_HEIGHT),
                1,
                1,
            );
        }
    }
}
