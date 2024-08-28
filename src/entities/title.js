class Title extends Entity {

    constructor(title, textBackground = 'rgba(0,0,0,0)', mainBackground = '#000') {
        super();

        this.buckets.push('title');

        this.textBackground = textBackground;

        this.canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, (ctx) => {
            ctx.fillStyle = mainBackground;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.globalCompositeOperation = nomangle('destination-out');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');
            ctx.font = nomangle('bold 148pt Impact');

            let y = CANVAS_HEIGHT / 2 - 100;
            for (const line of title.split('\n')) {
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
                y += 200;
            }
        });

        this.fromAge = 0;
        this.toAge = 1;
        this.fromAlpha = 1;
        this.toAlpha = 1;
    }

    fade(fromAlpha, toAlpha, duration) {
        this.fromAge = this.age;
        this.toAge = this.fromAge + duration;

        this.fromAlpha = fromAlpha;
        this.toAlpha = toAlpha;

        return this.agesBy(duration);
    }

    get alpha() {
        return interpolate(this.fromAlpha, this.toAlpha, (this.age - this.fromAge) / (this.toAge - this.fromAge));
    }

    render(camera) {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;

        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.fillStyle = this.textBackground;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.drawImage(this.canvas, 0, 0);
    }
}
