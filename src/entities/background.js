class Background extends Entity {

    constructor(topColor, bottomColor) {
        super();

        const ctx = document.createElement('canvas').getContext('2d');
        this.gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        this.gradient.addColorStop(0, topColor);
        this.gradient.addColorStop(1, bottomColor);

        this.mountains = [0.8, 0.5, 0.3].map(factor => {
            const color = multiplyColor(bottomColor, factor);
            const pattern = createCanvasPattern(400, 100, (ctx) => {
                ctx.fillStyle = color;

                const offset1 = Math.random() * 800;
                const offset2 = Math.random() * 800;

                ctx.beginPath();
                ctx.moveTo(0, 400);
                for (let x = 0 ; x <= 800 ; x += 100) {
                    ctx.lineTo(
                        x,
                        50
                            + sin((x + offset1) / 400 * Math.PI * 2) * 25
                            + sin((x + offset2) / 200 * Math.PI * 2) * 12
                    );
                }
                ctx.lineTo(800, 400);
                ctx.fill();
            });
            pattern.color = color;
            pattern.factor = factor;
            return pattern;
        });
    }

    render(camera) {
        ctx.wrap(() => {
            ctx.translate(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2);
            ctx.fillStyle = this.gradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

        ctx.wrap(() => {
            ctx.translate(camera.x * 0.9 + CANVAS_WIDTH / 4, camera.y * 0.1);
            ctx.fillStyle = '#faf857';
            ctx.beginPath();
            ctx.arc(0, 0, 200, 0, PI * 2);
            ctx.fill();
        });

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
