class Player extends Chopper {

    constructor() {
        super();
        this.buckets.push('player');

        this.ladderLength = 0;
        this.hangingPrisoner = null;
        this.rescuedPrisoners = 0;

        this.lastDamageBeep = 0;
    }

    destroy() {
        if (this.sound) {
            this.sound.stop();
            this.sound = null;
        }
    }

    cycle(elapsed) {
        const { lockedTargetFactor } = this;

        if (!this.sound && this.age > 0.5) {
            this.sound = new FunZZfx(zzfxG(...[,,317,,20,0,,3.2,-12,16,,,.07,.1,,,,.59,.18,.12])); // Shoot 71
            this.sound.source.loop = true;
            this.sound.start();
        }

        super.cycle(elapsed);

        const { controls } = this;

        // Keyboard controls
        controls.left = (DOWN[37] || DOWN[65] || DOWN[81]);
        controls.right = (DOWN[39] || DOWN[68]);
        controls.up = (DOWN[38] || DOWN[87] || DOWN[90]);
        controls.down = (DOWN[40] || DOWN[83]);
        controls.shoot = DOWN[32];

        // Touch controls
        for (const touch of TOUCHES) {
            const relX = touch.x / CANVAS_WIDTH;

            controls.left = controls.left || isBetween(0, relX, 0.25);
            controls.right = controls.right || isBetween(0.25, relX, 0.5);
            controls.shoot = controls.shoot || isBetween(0.5, relX, 0.75);
            controls.up = controls.up || isBetween(0.75, relX, 1);
        }

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

        if (this.sound) {
            this.sound.setVolume(interpolate(0.5, 1, this.propellerPower));
            this.sound.setRate(interpolate(0.5, 1, this.propellerPower));
        }

        // Warning beep
        if (this.age < this.damagedEnd && this.age - this.lastDamageBeep > 0.25) {
            this.lastDamageBeep = this.age;
            // sound(...[1,,154,,.07,.04,3,2.1,,,,,,.4,,,,.45,.04,.07,680]); // Hit 406
            sound(...[.4,,434,,.03,.01,3,2,,5,,,,,168,,,.76,.03,,520]); // Blip 639
        }

        // Target locking
        if (lockedTargetFactor === 0 && this.lockedTargetFactor > 0) {
            sound(...[,,354,.02,.28,.32,,.9,5,160,491,.07,.09,,,,,.66,.17,.39]); // Powerup 616
        }

        // Target locked
        if (lockedTargetFactor < 1 && this.lockedTargetFactor >= 1) {
            sound(...[2,,12,.01,.04,.006,,2.8,,,-436,.01,.02,,,,.14,.61,.02]); // Blip 591
        }
    }

    render(camera) {
        // Target lock on indicator
        ctx.wrap(() => {
            if (!this.lockedTarget) return;

            if (this.lockedTargetFactor >= 1 && this.lockedTargetTime < 1 && (this.lockedTargetTime / 0.2 % 1) < 0.5) {
                return;
            }

            ctx.strokeStyle = ctx.fillStyle = this.lockedTargetFactor >= 1 ? '#f00' : '#ff0';
            ctx.globalAlpha = interpolate(0, 0.2, this.lockedTargetFactor);
            ctx.beginPath();
            ctx.lineWidth = interpolate(40, 4, this.lockedTargetFactor);
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.lockedTarget.x, this.lockedTarget.y);
            ctx.stroke();

            ctx.translate(this.lockedTarget.x, this.lockedTarget.y);

            ctx.globalAlpha = this.lockedTargetFactor;
            ctx.shadowColor = '#000';
            ctx.shadowOffsetY = 2;

            const s = interpolate(2, 1, this.lockedTargetFactor);
            ctx.scale(s, s);

            ctx.rotate(this.age * PI);

            const radius = max(this.lockedTarget.radius, 20);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * PI);
            ctx.stroke();

            for (let i = 0 ; i < 4 ; i++) {
                ctx.rotate(PI / 2);
                ctx.fillRect(radius - 5, 0, 10, 2);
            }
        });

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

        super.render(camera);
    }
}
