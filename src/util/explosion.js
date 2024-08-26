function explosion(
    world,
    position,
    radius,
    owner,
) {

    sound(...[,,74,.06,.29,.54,4,3.1,,-8,,,,1.3,,.2,,.4,.24]);

    for (let i = 0 ; i < 10 ; i++) {
        world.add(new Fireball(
            position.x + rnd(-radius * 5 / 8, radius * 5 / 8),
            position.y + rnd(-radius * 5 / 8, radius * 5 / 8),
            -rnd(PI / 4, PI * 3 / 4),
            rnd(300, 600),
        ));
    }

    // Particles
    for (let i = 0 ; i < 30 ; i++) {
        const x = position.x + rnd(-radius * 5 / 8, radius * 5 / 8);
        const y = position.y + rnd(-radius * 5 / 8, radius * 5 / 8);
        world.add(new Particle(
            pick(['#000', '#ff0', '#f80']),
            [rnd(25, 30), 0],
            [x, x + rnd(-100, 100)],
            [y, y - rnd(50, 150)],
            rnd(1.2, 3),
        ));
    }

    // Damage targets
    for (const target of targets(world, owner)) { // TODO
        if (target === owner) continue;
        if (dist(target, position) > radius) continue;

        if (target.push) {
            target.push();
        } else {
            target.explode();
        }
    }

    // Camera shake
    for (const player of world.bucket('player')) {
        const power = 1 - dist(player, position) / (CANVAS_WIDTH / 2);
        if (power <= 0) continue;
        const camera = firstItem(world.bucket('camera'));
        camera.shake(power);
    }
}

function * targets(
    world,
    owner,
) {
    for (const target of world.bucket('human')) {
        if (target === owner) continue;
        yield target;
    }
    for (const target of world.bucket('chopper')) {
        if (target === owner) continue;
        yield target;
    }
}
