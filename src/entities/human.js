class Human extends Entity {
    constructor() {
        super();
        this.buckets.push('human');
        this.radius = 10;
    }

    explode() {
        this.world.remove(this);

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
