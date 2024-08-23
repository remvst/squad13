class Missile extends Entity {
    constructor(owner) {
        super();

        this.x = owner.x + cos(owner.angle) * 20;
        this.y = owner.y + sin(owner.angle) * 20;
        this.angle = owner.angle;
        this.owner = owner;
        this.speed = 500;
        this.radius = 10;

        this.nextParticle = 0;
    }

    explode() {
        this.world.remove(this);

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

        for (const target of this.targets()) {
            if (target === this.owner) continue;
            if (dist(target, this) > 50) continue;
            target.explode();
        }

        for (const player of this.world.bucket('player')) {
            const power = 1 - dist(player, this) / (CANVAS_WIDTH / 2);
            if (power <= 0) continue;
            const camera = firstItem(this.world.bucket('camera'));
            camera.shake(power);
        }
    }

    * targets() {
        yield* this.world.bucket('human');
        yield* this.world.bucket('chopper');
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age > 2) {
            this.explode();
            return;
        }


        for (const obstacle of this.world.bucket('obstacle')) {
            if (!isBetween(obstacle.minX, this.x, obstacle.maxX)) continue;

            if (obstacle.pushAway(this)) {
                this.explode();
            }
        }

        for (const chopper of this.world.bucket('chopper')) {
            if (chopper === this.owner) continue;
            if (!isBetween(chopper.x - 25, this.x, chopper.x + 25)) continue;
            if (!isBetween(chopper.y - 25, this.y, chopper.y + 25)) continue;

            this.explode();
        }

        for (const human of this.world.bucket('human')) {
            if (human === this.owner) continue;
            if (!isBetween(human.x - 10, this.x, human.x + 10)) continue;
            if (!isBetween(human.y - 10, this.y, human.y + 10)) continue;

            this.explode();
        }

        let angleSin = sin(this.angle);
        angleSin += between(
            -elapsed * 0.2,
            1 - sin(this.angle),
            elapsed * 0.2,
        );
        this.angle = atan2(angleSin, cos(this.angle));

        this.x += cos(this.angle) * elapsed * this.speed;
        this.y += sin(this.angle) * elapsed * this.speed;

        if ((this.nextParticle -= elapsed) <= 0) {
            this.nextParticle = 1 / 60;

            this.world.add(new Particle(
                '#fff',
                [rnd(5, 10), rnd(10, 20)],
                [this.x, this.x + rnd(-10, 10)],
                [this.y, this.y + rnd(-10, 10)],
                rnd(1.2, 3),
            ));
        }
    }
}
