class Background extends Entity {

    constructor(topColor, bottomColor) {
        super();

        const ctx = document.createElement('canvas').getContext('2d');
        this.gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        this.gradient.addColorStop(0, topColor);
        this.gradient.addColorStop(1, bottomColor);
    }

    render(camera) {
        ctx.translate(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2);
        ctx.fillStyle = this.gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
