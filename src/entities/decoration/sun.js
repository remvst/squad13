class Sun extends Entity {
    constructor(color)  {
        super();
        this.color = color;
        this.radius = 200;
    }

    render(camera) {
        ctx.translate(camera.x * 0.9 + CANVAS_WIDTH / 4, camera.y * 0.1);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, 200, 0, PI * 2);
        ctx.fill();
    }
}
