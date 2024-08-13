class Sprite {

    constructor() {
        this.x = this.y = this.z = 0;
        this.character = 'A';
    }

    render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.character, 0, 0);
        ctx.restore();
    }
}
