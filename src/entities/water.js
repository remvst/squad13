class Water extends Entity {

    constructor() {
        super();
        this.buckets.push('water');
    }

    render(camera) {
        ctx.wrap(() => {
            ctx.translate(camera.x - CANVAS_WIDTH / 2, this.y);

            ctx.fillStyle = ctx.strokeStyle = '#27c6dc';
            // ctx.fillRect(0, 0, CANVAS_WIDTH, 100);

            ctx.beginPath();
            for (let x = 0 ; x < CANVAS_WIDTH + 10 ; x += 10) {
                ctx.lineTo(
                    x,
                    abs(sin((x + camera.x) / 20 * PI / 2) * 10),
                );
            }
            ctx.lineTo(CANVAS_WIDTH, 100);
            ctx.lineTo(0, 100);
            ctx.fill();
        });
    }
}
