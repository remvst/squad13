class Fireball extends Entity {
    constructor(x, y, angle, speed, colors = ['#ff0', '#f80', '#000']) {
        super();

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.colors = colors;

        this.nextParticle = 0;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age > 1) {
            this.world.remove(this);
            return;
        }

        let angleSin = sin(this.angle);
        angleSin += between(
            -elapsed * 2,
            1 - sin(this.angle),
            elapsed * 2,
        )
        this.angle = atan2(angleSin, cos(this.angle));

        this.x += cos(this.angle) * elapsed * this.speed;
        this.y += sin(this.angle) * elapsed * this.speed;

        if ((this.nextParticle -= elapsed) <= 0) {
            this.nextParticle = 1 / 60;

            this.world.add(new Particle(
                pick(this.colors),
                [rnd(5, 10), 0],
                [this.x, this.x + rnd(-5, 5)],
                [this.y, this.y - rnd(20, 30)],
                rnd(1.2, 3),
            ));
        }
    }
}
