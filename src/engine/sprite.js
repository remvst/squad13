class Sprite {

    constructor() {
        this.x = this.y = this.z = 0;
        this.scaleX = this.scaleY = 1;
        this.rotation = 0;
        this.character = 'A';
    }

    render() {
        // console.log('go spr', this.x);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.character, 0, 0);
        ctx.restore();
    }
}
