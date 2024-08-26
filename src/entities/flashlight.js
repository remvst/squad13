class Flashlight extends Entity {

    constructor() {
        super();

        this.light = createCanvas(500, 400, (ctx, can) => {
            // ctx.fillStyle = '#f00';
            // ctx.fillRect(0, 0, can.width, can.height);

            const shadow = 50;

            ctx.shadowColor = '#fff';
            ctx.shadowBlur = shadow;

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(shadow, can.height / 2);
            ctx.arc(
                can.width - 200 - shadow,
                can.height / 2,
                can.height / 2,
                PI / 3,
                -PI / 3,
                true,
            );
            ctx.fill();
        });
    }

    render(camera) {
        const player = firstItem(this.world.bucket('player'));
        if (!player) return;

        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);
        ctx.translate(-20, 0);
        ctx.rotate(PI / 16);

        // ctx.fillStyle = '#fff';
        // ctx.fillRect(0, 0, 100, 100);
        ctx.globalAlpha = 0.05;

        ctx.drawImage(this.light, 0, -this.light.height / 2);
    }
}
