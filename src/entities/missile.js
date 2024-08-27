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

        sound(...[2.1,,51,.01,.12,.15,2,2.7,17,-19,,,,,,.2,.29,.93,.16]);
    }

    explode() {
        this.world.remove(this);
        sound(...[,,74,.06,.29,.54,4,3.1,,-8,,,,1.3,,.2,,.4,.24]);
        explosion(this.world, this, 80, this.owner);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age > 2) {
            this.explode();
            return;
        }

        for (const obstacle of this.world.bucket('obstacle')) {
            if (!isBetween(obstacle.minX, this.x, obstacle.maxX)) continue;

            const idealY = obstacle.yAt(this.x);
            if (sign(idealY - this.y) !== obstacle.directionY) {
                this.explode();
            }
        }

        for (const target of targets(this.world, this.owner)) {
            if (dist(target, this) > target.radius) continue;
            this.explode();
        }

        if (this.target) {
            const angleToTarget = normalize(angleBetween(this, this.target));
            this.angle += between(
                -elapsed * PI * 2,
                normalize(angleToTarget - normalize(this.angle)),
                elapsed * PI * 2,
            );
        } else {
            let angleSin = sin(this.angle);
            angleSin += between(
                -elapsed * 0.2,
                1 - sin(this.angle),
                elapsed * 0.2,
            );
            this.angle = atan2(angleSin, cos(this.angle));
        }

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
