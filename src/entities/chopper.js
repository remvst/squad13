class Hitbox {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isLanding = false;
        this.readjusted = false;
        this.vital = false;

        this.sound = null;
    }
}

class Chopper extends Entity {

    constructor() {
        super();

        this.buckets.push('chopper');

        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false,
        };

        this.lastShot = 0;

        this.hitBoxes = [
            new Hitbox(-10, 18, 5),
            new Hitbox(10, 18, 5),

            // Top
            new Hitbox(20, -15, 20),
            new Hitbox(-20, -15, 20),

            // Front (nose)
            new Hitbox(15, 0, 10),

            // Back propeller
            new Hitbox(-55, -10, 10),
        ];

        for (const landingHitbox of [
            this.hitBoxes[0],
            this.hitBoxes[1],
        ]) {
            landingHitbox.isLanding = true;
        }

        for (const hitbox of this.hitBoxes) {
            hitbox.vital = !hitbox.isLanding;
        }

        this.globalHitBoxes = [];

        this.propellerPower = 0;
        this.momentum = {x: 0, y: 0, angle: 0};

        this.landed = false;
        this.landedTime = 0;
    }

    updateGlobalHitboxes() {
        for (let i = 0 ; i < this.hitBoxes.length ; i++) {
            if (!this.globalHitBoxes[i]) {
                this.globalHitBoxes[i] = new Hitbox(0, 0, 0);
            }

            const hitBox = this.hitBoxes[i];
            const hitBoxAngle = Math.atan2(hitBox.y, hitBox.x);
            const dist = distP(0, 0, hitBox.x, hitBox.y);
            this.globalHitBoxes[i].x = this.x + Math.cos(this.angle + hitBoxAngle) * dist;
            this.globalHitBoxes[i].y = this.y + Math.sin(this.angle + hitBoxAngle) * dist;
            this.globalHitBoxes[i].radius = hitBox.radius;
            this.globalHitBoxes[i].isLanding = hitBox.isLanding;
            this.globalHitBoxes[i].vital = hitBox.vital;
            this.globalHitBoxes[i].readjusted = false;
        }
    }

    get averagePoint() {
        let x = 0, y = 0;
        for (const hitBox of this.globalHitBoxes) {
            x += hitBox.x;
            y += hitBox.y;
        }
        return {
            x: x / this.hitBoxes.length,
            y: y / this.hitBoxes.length,
        };
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age - this.lastShot > 1 && this.controls.shoot) {
            const missile = new Missile(this);
            this.world.add(missile);

            let bestTarget;
            let bestTargetAngleDiff = PI / 8;
            for (const target of this.world.bucket('human')) {
                if (target === this.owner) continue;
                if (dist(target, this) > 400) continue;
                const angleToTarget = normalize(angleBetween(this, target));

                const angleDiff = Math.abs(normalize(angleToTarget - normalize(this.angle)));
                if (angleDiff < bestTargetAngleDiff) {
                    bestTarget = target;
                    bestTargetAngleDiff = angleDiff;
                }
            }

            if (bestTarget) {
                missile.angle = angleBetween(this, bestTarget);
            }

            this.lastShot = this.age;
        }

        this.updateGlobalHitboxes();

        const { averagePoint } = this;

        for (const obstacle of this.world.bucket('obstacle')) {
            if (!isBetween(obstacle.minX - 100, this.x, obstacle.maxX + 100)) continue;

            for (const hitBox of this.globalHitBoxes) {
                hitBox.readjusted = hitBox.readjusted || obstacle.pushAway(hitBox);
            }
        }

        const landed = !this.globalHitBoxes.some(hitBox => hitBox.isLanding && !hitBox.readjusted);
        let crashed = this.globalHitBoxes.some(hitBox => hitBox.vital && hitBox.readjusted);

        for (const water of this.world.bucket('water')) {
            if (this.y >= water.y) {
                crashed = true;
            }
        }

        if (crashed) {
            this.explode();
            return;
        }

        const newAverage = this.averagePoint;

        const dX = newAverage.x - averagePoint.x;
        const dY = newAverage.y - averagePoint.y;

        if (dX || dY) {
            this.x += dX;
            this.y += dY;

            // this.momentum.x += dX / readjustedHitbboxes;
            // this.momentum.y += dY / readjustedHitbboxes;

            const angleOriginal = atan2(averagePoint.y, averagePoint.x);
            const angleNew = atan2(newAverage.y, newAverage.x);

            this.momentum.angle += angleOriginal - angleNew;
        }

        let x = 0, y = 0;
        if (this.controls.left) x -= 1;
        if (this.controls.right) x += 1;
        if (this.controls.up) y -= 1;
        if (this.controls.down) y += 1;

        const targetPower = this.controls.up ? 1 : 0;
        this.propellerPower += between(
            -elapsed * 4,
            targetPower - this.propellerPower,
            elapsed * 4,
        );

        let idealAngle = 0;
        let angleVelocity = PI / 6;
        if (!landed) {
            if (this.controls.left) idealAngle = -PI / 4;
            if (this.controls.right) idealAngle = PI / 4;
            if (this.controls.left || this.controls.right) angleVelocity = PI / 2;
        }

        this.angle += between(
            -elapsed * angleVelocity,
            idealAngle - this.angle,
            elapsed * angleVelocity
        )
        this.momentum.angle = 0;

        if (this.propellerPower) {
            this.momentum.x += this.propellerPower * Math.cos(this.angle - PI / 2) * elapsed * 400 * 1.5;
            this.momentum.y += this.propellerPower * Math.sin(this.angle - PI / 2) * elapsed * 400;
        }

        const opposition = Math.sign(Math.sin(this.angle)) !== Math.sign(this.momentum.x)
            ? 200
            : 50;

        this.momentum.x += between(
            -elapsed * opposition,
            -this.momentum.x,
            elapsed * opposition,
        );
        this.momentum.y += between(
            -elapsed * 200,
            400 - this.momentum.y,
            elapsed * 150,
        );

        if (landed && !this.propellerPower) {
            this.momentum.y = 0;
        }

        this.x += this.momentum.x * elapsed;
        this.y += this.momentum.y * elapsed;
        this.angle += this.momentum.angle * elapsed;

        const camera = firstItem(this.world.bucket('camera'));
        // this.x = between(camera.minX, this.x, camera.maxX);
        // this.y = between(camera.minY, this.y, camera.maxY);

        this.angle = between(-PI / 4, this.angle, PI / 4);

        this.landed = landed;
        if (this.landed) {
            this.landedTime += elapsed;
        } else {
            this.landedTime = 0;
        }

        if (!isBetween(camera.minX, this.x, camera.maxX)) {
            this.momentum.x = 0;
            this.x = between(camera.minX, this.x, camera.maxX);
        }

        if (!isBetween(camera.minY, this.y, camera.maxY)) {
            this.momentum.y = 0;
            this.y = between(camera.minY, this.y, camera.maxY);
        }

        if (!this.sound) {
            this.sound = new FunZZfx(zzfxG(...[,,317,,3,0,,3.2,-12,16,,,.07,.1,,,,.59,.18,.12])); // Shoot 71
            this.sound.source.loop = true;
            this.sound.start();
        }

        if (this.sound) {
            this.sound.setVolume(interpolate(0.5, 1, this.propellerPower));
            this.sound.setRate(interpolate(0.5, 1, this.propellerPower));
        }
    }

    destroy() {
        if (this.sound) {
            this.sound.stop();
        }
    }

    explode() {
        this.world.remove(this);

        this.destroy();
        sound(...[,,74,.06,.29,.54,4,3.1,,-8,,,,1.3,,.2,,.4,.24]);

        for (let i = 0 ; i < 10 ; i++) {
            const fireball = new Fireball(
                this.x + rnd(-50, 50),
                this.y + rnd(-50, 50),
                -rnd(PI / 4, PI * 3 / 4),
                rnd(300, 600),
            );
            this.world.add(fireball);
        }

        for (let i = 0 ; i < 30 ; i++) {
            const x = this.x + rnd(-50, 50);
            const y = this.y + rnd(-50, 50);
            const particle = new Particle(
                pick(['#000', '#ff0', '#f80', '#f00']),
                [rnd(25, 30), 0],
                [x, x + rnd(-100, 100)],
                [y, y - rnd(50, 150)],
                rnd(1.2, 3),
            );
            this.world.add(particle);
        }

    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillStyle = '#000';
            ctx.fillRect(-20, -15, 40, 30);

            ctx.fillRect(0, -10, -50, 5);
            ctx.fillRect(-60, -20, 10, 15);

            ctx.fillRect(-20, 20, 40, 2);
            ctx.fillRect(-10, 15, 2, 5);
            ctx.fillRect(10, 15, 2, 5);


            ctx.fillRect(-2, 0, 4, -22);

            ctx.wrap(() => {
                ctx.translate(0, -22);
                ctx.scale(1, 0.45);
                ctx.rotate(this.age * PI * 4);
                ctx.fillRect(-50, -3, 100, 6);
            });

            ctx.wrap(() => {
                ctx.translate(-55, -15);
                ctx.rotate(this.age * PI * 4);
                ctx.fillRect(-12, -2, 24, 4);
            });

            // ctx.strokeStyle = '#fff';
            // ctx.beginPath();
            // ctx.moveTo(0, 0);
            // ctx.lineTo(100, 0);
            // ctx.stroke();
        });

        // ctx.wrap(() => {
        //     ctx.translate(this.x, this.y);
        //     ctx.fillStyle = '#fff';
        //     ctx.translate(0, 50);
        //     for (const line of [
        //         `propeller: ${Math.round(this.propellerPower * 100)}`,
        //         `momentum: ${Math.round(this.momentum.x)},${Math.round(this.momentum.y)},${this.momentum.angle}`,
        //     ]) {
        //         ctx.fillText(line, 0, 0);
        //         ctx.translate(0, 20);
        //     }
        // });

        // for (const hitBox of this.globalHitBoxes) {
        //     ctx.fillStyle = hitBox.readjusted ? '#ff0' : '#0f0';
        //     ctx.beginPath();
        //     ctx.arc(hitBox.x, hitBox.y, hitBox.radius, 0, Math.PI * 2);
        //     ctx.fill();
        // }

        // const { averagePoint } = this;
        // ctx.fillStyle = '#00f';
        // ctx.fillRect(averagePoint.x - 2, averagePoint.y - 2, 4, 4);
    }

    crashed() {
        return this.world.waitFor(() => {
            if (!this.world.contains(this)) throw new Error();
        })
    }
}
