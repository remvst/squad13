const PERSPECTIVE = 200;

class Sprite {

    constructor() {
        this.x = this.y = this.z = 0;
        this.scaleX = this.scaleY = 1;
        this.rotation = 0;
        this.character = 'A';
    }

    render(camera) {
        const relDistX = (this.x - camera.x) / (CANVAS_WIDTH / 2);
        const relDistY = (this.y - camera.y) / (CANVAS_HEIGHT / 2);

        const addX = this.z * relDistX * PERSPECTIVE;
        const addY = this.z * relDistY * PERSPECTIVE;

        ctx.save();
        ctx.translate(this.x + addX, this.y + addY);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.character, 0, 0);
        ctx.restore();
    }
}
