class Mountains extends Entity {

    constructor(baseColor) {
        super();

        this.mountains = [0.8, 0.6, 0.4].map(factor => {
            const color = multiplyColor(baseColor, factor);
            const patt = createCanvasPattern(400, 100, (ctx) => {
                ctx.fillStyle = color;

                const offset1 = random() * 800;
                const offset2 = random() * 800;

                ctx.beginPath();
                ctx.moveTo(0, 400);
                for (let x = 0 ; x <= 800 ; x += 100) {
                    ctx.lineTo(
                        x,
                        50
                            + sin((x + offset1) / 400 * PI * 2) * 25
                            + sin((x + offset2) / 200 * PI * 2) * 12
                    );
                }
                ctx.lineTo(800, 400);
                ctx.fill();
            });
            patt.color = color;
            patt.factor = factor;
            return patt;
        });
    }

    render(camera) {
        let baseY = 0;
        for (let i = 0 ; i < this.mountains.length ; i++) {
            const mountains = this.mountains[i];
            const ratio = i / (this.mountains.length - 1);

            const factorX = interpolate(0.3, 0.8, ratio);
            const factorY = interpolate(0.1, 0.1, ratio);

            ctx.wrap(() => {
                const topY = ~~(camera.y * factorY + baseY);
                ctx.translate(camera.x - CANVAS_WIDTH / 2, topY);

                ctx.wrap(() => {
                    const offsetX = camera.x * factorX;
                    ctx.translate(-offsetX, 0);
                    ctx.fillStyle = mountains;
                    ctx.fillRect(offsetX, 0, CANVAS_WIDTH, mountains.height);
                })

                ctx.fillStyle = mountains.color;
                ctx.fillRect(0, mountains.height, CANVAS_WIDTH, camera.y + CANVAS_HEIGHT - topY - 200);
            });

            baseY += 50;
        }
    }
}
