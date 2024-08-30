class EnemyChopper extends Chopper {

    constructor() {
        super(-1);

        this.buckets.push('enemy-chopper');

        this.reachedTarget = false;
        this.path = [];

        this.lastWarningBeep = 0;

        this.lockedTargetKeepAngle = PI;
    }

    follow(path) {
        this.path = path;
        return this;
    }

    render(camera) {
        ctx.wrap(() => {
            if (this.lockedTargetFactor <= 0) return;

            ctx.translate(this.x, this.y);

            const repeatedLockFactor = (this.lockedTargetFactor % 0.25) / 0.25;

            ctx.fillStyle = '#f00';
            ctx.globalAlpha = interpolate(1, 0, repeatedLockFactor);

            const s = interpolate(0, 1, repeatedLockFactor);
            ctx.scale(s, s);

            ctx.beginPath();
            ctx.arc(0, 0, 150, 0, PI * 2);
            ctx.fill();
        });

        super.render(camera);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.controls.up = false;
        this.controls.left = false;
        this.controls.right = false;

        const target = this.path[0]
        if (!target) return;

        const distToTarget = dist(target, this);

        if (distToTarget > 10) {
            const future = this.futurePosition();
            this.controls.right = future.x < target.x - 10;
            this.controls.left = future.x > target.x + 10;
            this.controls.up = future.y > target.y;
        } else {
            this.path.push(this.path.shift());
        }

        this.controls.shoot = this.lockedTargetFactor >= 1;

        if (this.lockedTargetFactor > 0 && this.age - this.lastWarningBeep > 0.2) {
            this.lastWarningBeep = this.age;
            sound(...[.4,,434,,.03,.01,3,2,,5,,,,,168,,,.76,.03,,520]); // Blip 639
        }
    }
}
