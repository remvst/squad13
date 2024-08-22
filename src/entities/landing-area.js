class LandingArea extends Entity {
    constructor() {
        super();
        this.buckets.push('landing-area');
    }

    render() {
        const player = firstItem(this.world.bucket('player'));

        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#0f0';
            ctx.fillRect(-100, 0, 200, 50);
            if (player) ctx.fillRect(-100, 0, interpolate(0, 200, this.landedRatio(player)), 50);

            ctx.globalAlpha = 1;
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 24pt Impact';
            ctx.fillText('FINISH', 0, 25);
        });
    }

    landed(chopper) {
        return this.world.waitFor(() => {
            return this.landedRatio(chopper) >= 1;
        });
    }

    landedRatio(chopper) {
        if (!isBetween(this.x - 100, chopper.x, this.x + 100)) return 0;
        if (!isBetween(this.y - 100, chopper.y, this.y + 100)) return 0;
        return chopper.landedTime / 1;
    }
}
