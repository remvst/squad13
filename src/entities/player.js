class Player extends Chopper {

    constructor() {
        super();
        this.buckets.push('player');

        this.ladderLength = 0;
        this.hangingPrisoner = null;
        this.rescuedPrisoners = 0;
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

        let hasPrisoner;
        for (const prisoner of this.world.bucket('prisoner')) {
            if (dist(prisoner, this) < 150) {
                hasPrisoner = prisoner;
            }
        }

        const targetLadderLength = hasPrisoner && !this.hangingPrisoner ? 100 : 0;

        if (targetLadderLength && !this.ladderLength) {
            sound(...[,,100,.01,.08,.14,1,.8,10,,,,,,,,,.55,.02]); // Jump 405
        }

        this.ladderLength += between(
            -elapsed * 100,
            targetLadderLength - this.ladderLength,
            elapsed * 100,
        );

        if (!this.sound) {
            this.sound = new FunZZfx(zzfxG(...[,,317,,3,0,,3.2,-12,16,,,.07,.1,,,,.59,.18,.12])); // Shoot 71
            this.sound.source.loop = true;
            this.sound.start();
        }

        if (this.sound) {
            this.sound.setVolume(interpolate(0.5, 1, this.propellerPower));
            this.sound.setRate(interpolate(0.5, 1, this.propellerPower));
        }

        if (this.damagedTimeLeft > 0 && this.age - this.lastDamageBeep > 0.25) {
            this.lastDamageBeep = this.age;
            sound(...[1,,154,,.07,.04,3,2.1,,,,,,.4,,,,.45,.04,.07,680]); // Hit 406
        }
    }

    render(camera) {
        super.render(camera);

        // Ladder
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);
            ctx.fillStyle = '#000';
            ctx.fillRect(-5, 0, 2, this.ladderLength);
            ctx.fillRect(5, 0, -2, this.ladderLength);

            for (let y = this.ladderLength ; y >= 0 ; y -= 10) {
                ctx.fillRect(-5, y, 10, 2);
            }
        });

        // Target lock on indicator
        ctx.wrap(() => {
            if (!this.lockedTarget) return;

            ctx.translate(this.lockedTarget.x, this.lockedTarget.y);

            const s = interpolate(2, 1, this.lockedTargetFactor);
            ctx.scale(s, s);

            ctx.globalAlpha = this.lockedTargetFactor;

            ctx.rotate(this.age * PI);

            const radius = Math.max(this.lockedTarget.radius, 20);
            ctx.strokeStyle = ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * PI);
            ctx.stroke();

            for (let i = 0 ; i < 4 ; i++) {
                ctx.rotate(PI / 2);
                ctx.fillRect(radius - 5, 0, 10, 2);
            }
        });
    }
}
