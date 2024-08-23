sunset = () => new Background('#f22f00', '#fa7f02');
spawn = (world, x) => {
    const landing = Obstacle.landingObstacle(x, 100, 200);
    world.add(landing);

    const player = new Player();
    player.x = x;
    player.y = landing.yAt(player.x) - 20;
    world.add(player);

    const camera = firstItem(world.bucket('camera'));
    camera.cycle(2);

    return player;
}
setTarget = (world, x) => {
    world.add(Obstacle.landingObstacle(x, 100, 200));

    const target = new LandingArea();
    target.x = x;
    target.y = 100;
    world.add(target);

    return target;
}
promise = (world) => {
    const player = firstItem(world.bucket('player'));
    const target = firstItem(world.bucket('landing-area'));

    return Promise.race([
        player.crashed(),
        target.landed(player),
    ]);
}
rebel = (world, x) => {
    const rebel = new Rebel();
    rebel.x = x;
    world.add(rebel);

    for (const obstacle of world.bucket('obstacle')) {
        if (obstacle.directionY < 0) continue;
        if (!isBetween(obstacle.minX, rebel.x, obstacle.maxX)) continue;

        const idealY = obstacle.yAt(rebel.x);
        if (idealY === null) {
            throw new Error('idealY is null');
        }
        rebel.y = obstacle.yAt(rebel.x) - rebel.radius;
    }
}

tutorialFly = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 1500;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());

    world.add(Obstacle.landingObstacle(1000, 100, 200));

    const player = spawn(world, 0);
    setTarget(world, 1000);

    world.add(new Water(400));

    const upInstruction = new Instruction('HOLD [UP] TO FLY');
    upInstruction.y = -200;
    world.add(upInstruction);

    const tiltInstruction = new Instruction('HOLD [LEFT/RIGHT] TO TILT');
    tiltInstruction.x = 500;
    tiltInstruction.y = -200;
    world.add(tiltInstruction);

    world.waitFor(() => {
        const tilt = distP(player.x, player.y, 0, 100) > 200;
        upInstruction.instruction = tilt ? '' : 'HOLD [UP] TO FLY';
        tiltInstruction.instruction = tilt ? 'HOLD [LEFT/RIGHT] TO TILT' : '';
    });

    return promise(world);
}

firstMountain = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 3500;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);
    world.add(Obstacle.mountain(500, 2500, -200, 200, 1));

    setTarget(world, 3000);

    world.add(new Water(400));

    return promise(world)
};

mountainThenCeiling = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 7000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);

    world.add(Obstacle.mountain(500, 2500, -200, 200, 1));
    world.add(Obstacle.ceiling(3000, 5500, -200, 100, 1));
    world.add(Obstacle.mountain(4000, 5000, 100, 300, 0.5));
    world.add(Obstacle.mountain(5700, 6000, 200, 300, 0.5));
    world.add(Obstacle.landingObstacle(6500, 100, 200));

    const target = new LandingArea();
    target.x = 6500;
    target.y = 100;
    world.add(target);
    world.add(new Water(400));

    return promise(world)
};

tutorialShoot = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);
    world.add(Obstacle.mountain(500, 2500, -150, 100, 1.5));
    world.add(Obstacle.mountain(2700, 3000, 0, 200, 2));
    world.add(Obstacle.ceiling(2000, 3000, -500, -350, 2));
    world.add(Obstacle.landingObstacle(3500, 100, 200));

    const target = new LandingArea();
    target.x = 3500;
    target.y = 100;
    world.add(target);
    world.add(new Water(400));

    for (const x of [800, 850, 1500, 2300]) {
        rebel(world, x);
    }

    const instruction = new Instruction('PRESS [SPACE] TO SHOOT');
    instruction.x = 500;
    instruction.y = -200;
    world.add(instruction);

    return promise(world)
};


caveThenCeiling = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 4500;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);
    world.add(Obstacle.mountain(500, 2000, -200, 200, 0.5));
    world.add(Obstacle.ceiling(400, 1500, -500, -200, 0.5));
    world.add(Obstacle.ceiling(2500, 3500, -600, 0, 1));
    world.add(Obstacle.mountain(2300, 2700, 200, 300, 0.5));

    setTarget(world, 4000);

    world.add(new Water(400));

    for (const x of [1200, 1750, 1850, 2650]) {
        rebel(world, x);
    }
    return promise(world)
};

lowCeiling = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);

    world.add(Obstacle.ceiling(500, 1500, -200, 100, 0.5));
    world.add(Obstacle.mountain(900, 1500, 300, 400, 1));
    // world.add(Obstacle.landingObstacle(2000, 80, 200));
    world.add(Obstacle.mountain(1800, 2200, 50, 150, 1));

    world.add(Obstacle.mountain(2300, 2800, 300, 350, 2));
    world.add(Obstacle.ceiling(2500, 4000, -200, 100, 1));
    world.add(Obstacle.mountain(3800, 4200, 250, 350, 3));

    setTarget(world, 4500);

    world.add(new Water(400));

    for (const x of [1450, 2050, 2650, 4050]) {
        rebel(world, x);
    }
    return promise(world)
}

hardMountains = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 6000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);
    world.add(Obstacle.mountain(500, 4500, -200, 200, 2));
    world.add(Obstacle.ceiling(2500, 3500, -600, -200, 0.5));

    setTarget(world, 5500);

    world.add(new Water(400));

    for (const x of [1000, 1900, 2050, 2500, 3000, 3500, 4400, 4200]) {
        rebel(world, x);
    }
    return promise(world)
}

smallMountainSuccession = world => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 4500;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);
    world.add(Obstacle.mountain(500, 1000, 0, 200, 2));
    world.add(Obstacle.ceiling(900, 1500, -400, -500, 2));
    world.add(Obstacle.mountain(1500, 2000, -200, 0, 1.5));
    world.add(Obstacle.ceiling(1800, 2600, -400, -500, 2.5));
    world.add(Obstacle.mountain(2500, 3500, -200, 200, 3));
    world.add(Obstacle.ceiling(3000, 4000, -400, -550, 4));

    setTarget(world, 4000);

    world.add(new Water(400));

    for (const x of [850, 1600, 1850, 2600, 2900, 3350, 3450]) {
        rebel(world, x)
    }
    return promise(world)
}

upAndDown = (world) => {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5500;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());
    spawn(world, 0);
    world.add(Obstacle.mountain(500, 1000, 0, 200, 2));
    world.add(Obstacle.ceiling(900, 1500, -500, -300, 2));
    world.add(Obstacle.mountain(1400, 2500, -150, 200, 2));
    world.add(Obstacle.ceiling(2400, 3500, -400, -200, 2));
    world.add(Obstacle.mountain(2800, 4000, -50, 200, 1.5));
    // world.add(Obstacle.mountain(1500, 2000, -200, 0, 1.5));
    // world.add(Obstacle.ceiling(1800, 2600, -400, -500, 2.5));
    // world.add(Obstacle.mountain(2500, 3500, -200, 200, 3));
    // world.add(Obstacle.ceiling(3000, 4000, -400, -550, 4));

    setTarget(world, 4500);

    world.add(new Water(400));

    for (const x of [850, 1600, 1850, 2600, 2900, 3350, 3450, 3900]) {
        rebel(world, x)
    }
    return promise(world)
}
