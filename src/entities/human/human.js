class Human extends Entity {
    constructor() {
        super();
        this.buckets.push('human');
        this.radius = 10;
    }

    explode() {
        this.world.remove(this);

        for (let i = 0 ; i < 10 ; i++) {
            this.world.add(new Fireball(
                this.x + rnd(-20, 20),
                this.y + rnd(-20, 20),
                -rnd(PI / 4, PI * 3 / 4),
                rnd(100, 150),
                ['#f00', '#900'],
            ));
        }

        // Particles
        for (let i = 0 ; i < 50 ; i++) {
            const x = this.x + rnd(-20, 20);
            const y = this.y + rnd(-20, 20);
            const angle = rnd(0, PI * 2);
            const dist = rnd(30, 80);
            this.world.add(new Particle(
                pick(['#f00', '#900']),
                [rnd(10, 20), 0],
                [x, x + cos(angle) * dist],
                [y, y + sin(angle) * dist],
                rnd(2, 4),
            ));
        }
    }
}
