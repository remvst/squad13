class ProgressIndicator extends Entity {

    constructor(labels) {
        super();
        this.labels = labels;
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.shadowColor = '#000';
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#fff';

        let y = 50;
        for (const [label, value] of this.labels()) {
            ctx.font = '14pt Courier';
            ctx.fillText(label, CANVAS_WIDTH - 50, y);
            y += 20;

            ctx.fillText(value, CANVAS_WIDTH - 50, y);
            y += 30;
        }
    }
}
