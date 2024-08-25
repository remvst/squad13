class RunRecap extends Entity {

    constructor(labels) {
        super();
        this.labels = labels;
    }

    render(camera) {
        ctx.translate(~~camera.x, ~~camera.y);
        ctx.textBaseline = 'top';
        ctx.shadowColor = '#000';
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#fff';

        let y = 50;
        for (const [label, value] of this.labels()) {
            ctx.font = '18pt Courier';

            ctx.textAlign = 'right';
            ctx.fillText(label, -20, y);

            ctx.textAlign = 'left';
            ctx.fillText(value, 20, y);

            y += 30;
        }
    }
}
