class ProgressIndicator extends Entity {

    constructor(labels) {
        super();
        this.labels = labels;
    }

    render(camera) {
        ctx.translate(~~camera.x + CANVAS_WIDTH / 2 - 50, ~~camera.y - CANVAS_HEIGHT / 2 + 50);
        ctx.textAlign = nomangle('right');
        ctx.textBaseline = nomangle('top');
        ctx.shadowColor = '#000';
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#fff';

        if (inputMode === INPUT_MODE_TOUCH) {
            ctx.scale(1.5, 1.5);
        }

        let y = 0;
        for (const [label, value] of this.labels()) {
            ctx.font = nomangle('14pt Courier');
            ctx.fillText(label, 0, y);
            y += 20;

            ctx.fillText(value, 0, y);
            y += 30;
        }
    }
}
