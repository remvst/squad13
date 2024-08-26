class Rain extends Entity {

    constructor() {
        super();
        this.rng = new RNG();
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.fillStyle = '#fff';

        if (this.age % 4 < 0.4) {
            ctx.wrap(() => {
                ctx.globalAlpha = sin(this.age * PI * 10) * 0.1 + 0.1;
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            });
        }

        this.rng.reset();
        for (let i = 0 ; i < 200 ; i++)  {
            const baseX = this.rng.next(0, CANVAS_WIDTH);
            const finalX = baseX + this.rng.next(20, 50);
            const period = this.rng.next(0.5, 1.5);
            const offset = this.rng.next(0, period);

            const ratio = ((this.age + offset) % period) / period;

            ctx.fillRect(
                interpolate(baseX, finalX, ratio),
                interpolate(0, CANVAS_HEIGHT, ratio),
                1,
                10,
            );
        }
    }
}
