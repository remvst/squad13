const PERSPECTIVE = 50;

class Sprite {

    constructor() {
        this.reset();
    }

    get actualZ() {
        return (this.parent ? this.parent.actualZ : 0) + this.z;
    }

    reset() {
        this.parent = null;
        this.x = this.y = this.z = 0;
        this.scaleX = this.scaleY = 1;
        this.anchorX = this.anchorY = 0.5;
        this.color = '#fff';
        this.rotation = 0;
        this.character = 'A';
    }

    applyTransforms(camera) {
        if (this.parent) this.parent.applyTransforms(camera);

        const relDistX = (this.x - camera.x) / (CANVAS_WIDTH / 2);
        const relDistY = (this.y - camera.y) / (CANVAS_HEIGHT / 2);

        const addX = this.z * relDistX * PERSPECTIVE;
        const addY = this.z * relDistY * PERSPECTIVE;
        ctx.translate(this.x + addX, this.y + addY);
        ctx.rotate(this.rotation);
    }

    render(camera) {
        ctx.save();

        this.applyTransforms(camera);
        ctx.scale(this.scaleX, this.scaleY);

        const sprite = characterSprite(this.character, 4, this.color);
        if (sprite) ctx.drawImage(
            sprite,
            interpolate(0, -sprite.width, this.anchorX),
            interpolate(0, -sprite.height, this.anchorY),
        );

        // ctx.fillStyle = '#f00';
        // ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
    }
}
