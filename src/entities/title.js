class Title extends Entity {

    constructor(title, background = 'rgba(0,0,0,0)') {
        super();

        this.buckets.push('title');

        this.background = background;

        this.canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, (ctx) => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.globalCompositeOperation = 'destination-out';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 148pt Impact';

            let y = CANVAS_HEIGHT / 2 - 100;
            for (const line of title.split('\n')) {
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
                y += 200;
            }
        });

        this.fade(1, 1, 9999, 0);
    }

    fade(fromAlpha, toAlpha, duration, delay) {
        this.fromAge = this.age + delay;
        this.toAge = this.fromAge + duration;

        this.fromAlpha = fromAlpha;
        this.toAlpha = toAlpha;

        return this;
    }

    get alpha() {
        return interpolate(this.fromAlpha, this.toAlpha, (this.age - this.fromAge) / (this.toAge - this.fromAge));
    }

    render(camera) {
        ctx.globalAlpha = this.alpha;

        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.drawImage(this.canvas, 0, 0);
    }
}
