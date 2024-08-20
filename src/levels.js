sunset = () => new Background('#f22f00', '#fa7f02');

tutorialFly = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());

    world.add(Obstacle.landingObstacle(0, 100, 200));
    world.add(Obstacle.landingObstacle(1000, 100, 200));

    const player = new Player();
    world.add(player);
    world.add(new Water(400));

    const target = new LandingArea();
    target.x = 1000;
    target.y = 100;
    world.add(target);

    const instruction = new Instruction('HOLD [UP] TO FLY');
    instruction.y = -200;
    world.add(instruction);

    return Promise.race([
        player.crashed(),
        target.landed(player),
    ]);
}

firstMountain = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    world.add(Obstacle.landingObstacle(0, 100, 200));
    world.add(Obstacle.mountain(500, 2500, -200, 200, 1));
    world.add(Obstacle.landingObstacle(3000, 100, 200));

    const player = new Player();
    world.add(player);

    const target = new LandingArea();
    target.x = 3000;
    target.y = 100;
    world.add(target);
    world.add(new Water(400));

    return Promise.race([
        player.crashed(),
        target.landed(player),
    ]);
};

mountainThenCeiling = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 7000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    world.add(Obstacle.landingObstacle(0, 100, 200));
    world.add(Obstacle.mountain(500, 2500, -200, 200, 1));
    world.add(Obstacle.ceiling(3000, 5500, -200, 100, 1));
    world.add(Obstacle.landingObstacle(6500, 100, 200));

    const player = new Player();
    world.add(player);

    const target = new LandingArea();
    target.x = 6500;
    target.y = 100;
    world.add(target);
    world.add(new Water(400));

    return Promise.race([
        player.crashed(),
        target.landed(player),
    ]);
};

tutorialShoot = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    world.add(Obstacle.landingObstacle(0, 100, 200));
    world.add(Obstacle.mountain(500, 2500, -150, 100, 0.5));
    world.add(Obstacle.landingObstacle(3500, 100, 200));

    const player = new Player();
    world.add(player);

    const target = new LandingArea();
    target.x = 3500;
    target.y = 100;
    world.add(target);
    world.add(new Water(400));

    for (const x of [1500, 2400]) {
        const rebel = new Rebel();
        rebel.x = x;
        world.add(rebel);
    }

    const instruction = new Instruction('PRESS [SPACE] TO SHOOT');
    instruction.x = 500;
    instruction.y = -200;
    world.add(instruction);

    return Promise.race([
        player.crashed(),
        target.landed(player),
    ]);
};


caveThenCeiling = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    world.add(Obstacle.landingObstacle(0, 100, 200));
    world.add(Obstacle.mountain(500, 2000, -200, 200, 0.5));
    world.add(Obstacle.ceiling(500, 1500, -500, -200, 0.5));
    world.add(Obstacle.ceiling(2500, 3500, -600, 0, 1));
    world.add(Obstacle.landingObstacle(4000, 100, 200));

    const player = new Player();
    world.add(player);

    const target = new LandingArea();
    target.x = 4000;
    target.y = 100;
    world.add(target);
    world.add(new Water(400));

    for (const x of [1750, 1850]) {
        const rebel = new Rebel();
        rebel.x = x;
        world.add(rebel);
    }
    return Promise.race([
        player.crashed(),
        target.landed(player),
    ]);
};
