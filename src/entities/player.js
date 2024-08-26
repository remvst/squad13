class Player extends Chopper {

    constructor() {
        super();
        this.buckets.push('player');
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const title = firstItem(this.world.bucket('title'));
        const hasTitle = title && title.alpha > 0.5;

        this.controls.left = (DOWN[37] || DOWN[65]) && !hasTitle;
        this.controls.right = (DOWN[39] || DOWN[68]) && !hasTitle;
        this.controls.up = (DOWN[38] || DOWN[87]) && !hasTitle;
        this.controls.down = (DOWN[40] || DOWN[83]) && !hasTitle;
        this.controls.shoot = DOWN[32] && !hasTitle;
    }

    render(camera) {
        super.render(camera);

        ctx.wrap(() => {
            if (!this.lockedTarget) return;

            ctx.translate(this.lockedTarget.x, this.lockedTarget.y);

            const s = interpolate(2, 1, this.lockedTargetFactor);
            ctx.scale(s, s);

            ctx.globalAlpha = this.lockedTargetFactor;

            ctx.rotate(this.age * PI);

            ctx.strokeStyle = ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(0, 0, this.lockedTarget.radius, 0, 2 * PI);
            ctx.stroke();

            for (let i = 0 ; i < 4 ; i++) {
                ctx.rotate(PI / 2);
                ctx.fillRect(this.lockedTarget.radius - 5, 0, 10, 2);
            }
        });
    }
}
