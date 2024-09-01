sunset = () => ([
    new Background('#f22f00', '#fa7f02'),
    new Sun('#faf857'),
    new Mountains('#fa7f02'),
])
daytime = () => ([
    new Background('#51ccfc', '#c2e9fc'),
    new Sun('#faf857'),
    new Mountains('#c2e9fc'),
])
night = () => ([
    // new Background('#01010a', '#092644'),
    new Background('#092644', '#01010a'),
    new Stars(),
    new Sun('#fff'),
    new Mountains('#092644'),
    new Rain(),
    new Flashlight(),
])
spawn = (world, x, y = 100) => {
    landingObstacle(world, x, y, 200);

    const player = new Player();
    player.x = x;
    player.y = y - 20;
    world.add(player);

    const camera = firstItem(world.bucket('camera'));
    camera.minX = min(camera.minX, x - 300);

    return player;
}
setTarget = (world, x, y = 100) => {
    landingObstacle(world, x, y, 200);

    const target = new LandingArea();
    target.x = x;
    target.y = 100;
    world.add(target);

    const camera = firstItem(world.bucket('camera'));
    camera.maxX = x + 500;

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
            // throw new Error('idealY is null');
        }
        rebel.y = idealY - rebel.radius;
    }
}

enemyChopper = (world, path) => {
    const enemyChopper = new EnemyChopper();
    enemyChopper.x = path[0].x;
    enemyChopper.y = path[0].y;
    enemyChopper.follow(path);
    world.add(enemyChopper);
}

prisoner = (world, x) => {
    const prisoner = new Prisoner();
    prisoner.x = x;
    world.add(prisoner);

    for (const obstacle of world.bucket('obstacle')) {
        if (obstacle.directionY < 0) continue;
        if (!isBetween(obstacle.minX, prisoner.x, obstacle.maxX)) continue;

        const idealY = obstacle.yAt(prisoner.x);
        if (idealY === null) {
            throw new Error('idealY is null');
        }
        prisoner.y = obstacle.yAt(prisoner.x) - prisoner.radius;
    }
}

water = (world, y) => {
    const camera = firstItem(world.bucket('camera'));
    world.add(new Water(y));
    camera.maxY = max(camera.maxY, y + 300);
}

landingObstacle = (world, x, y, length = 100) => {
    const obstacle = new Obstacle();
    obstacle.points = [
        { x: x - length, y: y + 2000 },
        { x: x - length / 2 - 50, y: y - 10 },
        { x: x - length / 2, y },
        { x: x + length / 2, y },
        { x: x + length / 2 + 50, y: y - 10 },
        { x: x + length, y: y + 2000 },
    ];
    world.add(obstacle);

    const camera = firstItem(world.bucket('camera'));
    camera.minY = min(camera.minY, y - CANVAS_HEIGHT / 2 - 200);
};

sinePoints = (world, points, startX, endX, minY, maxY, periodCount) => {
    const length = endX - startX;
    const amplitude = maxY - minY;

    for (let x = startX; x <= endX; x += 100) {
        points.push({
            x: x,
            y: minY + amplitude / 2
                + sin(x / length * PI * 2 * periodCount) * amplitude / 2
                + sin(x / length * PI * 2 * periodCount * 4) * amplitude / 4,
        });
    }

    const camera = firstItem(world.bucket('camera'));
    camera.minY = min(camera.minY, minY - 200, maxY - 200);
    camera.maxY = max(camera.maxY, minY + 300, maxY + 300);
}

mountain = (world, startX, endX, minY, maxY, periodCount = 1) => {
    const obstacle = new Obstacle();
    obstacle.points.push({ x: startX - 100, y: maxY + 2000 });
    sinePoints(world, obstacle.points, startX, endX, minY, maxY, periodCount);
    obstacle.points.push({ x: endX + 100, y: maxY + 2000 });
    world.add(obstacle);
}

ceiling = (world, startX, endX, minY, maxY, periodCount = 1) => {
    const obstacle = new Obstacle();
    obstacle.directionY = -1;
    obstacle.points.push({ x: startX - 100, y: maxY - 2000 });
    sinePoints(world, obstacle.points, startX, endX, minY, maxY, periodCount);
    obstacle.points.push({ x: endX + 100, y: maxY - 2000 });
    world.add(obstacle);
}

tutorialFly = (world) => {
    const player = spawn(world, 0);
    setTarget(world, 1000);

    water(world, 400);

    const upInstruction = new Instruction('');
    upInstruction.y = -200;
    world.add(upInstruction);

    const tiltInstruction = new Instruction('');
    tiltInstruction.x = 500;
    tiltInstruction.y = -200;
    world.add(tiltInstruction);

    const downInstruction = new Instruction('');
    downInstruction.x = 1000;
    downInstruction.y = -200;
    world.add(downInstruction);

    world.waitFor(() => {
        const down = abs(player.x - 1000) < 200;
        const tilt = !down && distP(player.x, player.y, 0, 100) > 200;
        const up = !down && !tilt;

        upInstruction.instruction = up ? nomangle('HOLD [UP] TO FLY') : '';
        tiltInstruction.instruction = tilt ? nomangle('HOLD [LEFT/RIGHT] TO TILT') : '';
        downInstruction.instruction = down && !player.simplifiedPhysics ? nomangle('HOLD [DOWN] TO DESCEND FASTER') : '';
    });

    return promise(world);
}

firstMountain = (world) => {

    spawn(world, 0);
    mountain(world, 500, 2500, -200, 200, 1);
    ceiling(world, 2700, 3500, -400, -300, 2);

    setTarget(world, 3000);

    water(world, 400);

    return promise(world)
};

mountainThenCeiling = (world) => {

    spawn(world, 0);

    mountain(world, 500, 2500, -200, 200, 1);
    ceiling(world, 3000, 5500, -200, 100, 1);
    mountain(world, 4000, 5000, 100, 300, 0.5);
    mountain(world, 5700, 6000, 200, 300, 0.5);

    setTarget(world, 6500);

    water(world, 400);

    const rescueInstruction = new Instruction(nomangle('PRISONERS CAN BE RESCUED'));
    rescueInstruction.x = 500;
    rescueInstruction.y = -200;
    world.add(rescueInstruction);

    prisoner(world, 1000);
    prisoner(world, 2400);
    prisoner(world, 4500);

    return promise(world)
};

tutorialShoot = (world) => {
    const player = spawn(world, 0);
    mountain(world, 500, 2500, -150, 100, 1.5);
    mountain(world, 2700, 3000, 0, 200, 2);
    ceiling(world, 2000, 3000, -500, -350, 2);
    mountain(world, 3700, 3950, 400, 300, 0.5);

    setTarget(world, 3500);

    water(world, 400);

    for (const x of [800, 850, 1500, 2300]) {
        rebel(world, x);
    }

    prisoner(world, 2000);
    prisoner(world, 3800);

    const instruction = new Instruction(
        inputMode === INPUT_MODE_TOUCH
            ? nomangle('TAP CIRCLE TO SHOOT')
            : nomangle('PRESS [SPACE] TO SHOOT')
    );
    instruction.x = 500;
    instruction.y = -200;
    world.add(instruction);

    world.waitFor(() => {
        instruction.instruction = player.shotInterval < 9
            ? nomangle('PRESS [SPACE] TO SHOOT')
            : nomangle('NO MISSILES ON HARD MODE');
    });

    return promise(world)
};

caveThenCeiling = (world) => {
    spawn(world, 0);
    mountain(world, 500, 2000, -200, 200, 0.5);
    ceiling(world, 400, 1500, -500, -200, 0.5);
    ceiling(world, 2500, 3500, -600, 0, 1);
    mountain(world, 2300, 2700, 200, 300, 0.5);
    ceiling(world, 3700, 4200, -300, -450, 2);

    setTarget(world, 4000);

    water(world, 400);

    for (const x of [650, 1200, 1750, 1850, 2650]) {
        rebel(world, x);
    }

    prisoner(world, 950);
    prisoner(world, 1350);
    prisoner(world, 2350);

    return promise(world)
};

lowCeiling = (world) => {
    spawn(world, 0);

    ceiling(world, 500, 1500, -200, 100, 0.5);
    mountain(world, 900, 1500, 300, 400, 1);
    mountain(world, 1800, 2200, 50, 150, 1);

    mountain(world, 2300, 2800, 300, 350, 2);
    ceiling(world, 2500, 4000, -200, 100, 1);
    mountain(world, 3800, 4200, 250, 350, 3);

    setTarget(world, 4500);

    water(world, 400);

    for (const x of [1450, 2050, 2650, 4050]) {
        rebel(world, x);
    }

    prisoner(world, 1050);
    prisoner(world, 2450);
    prisoner(world, 4150);
    enemyChopper(world, [
        { x: 1800, y: -300 },
        { x: 2200, y: -200 },
    ])

    return promise(world)
}

hardMountains = (world) => {
    spawn(world, 0);
    ceiling(world, -200, 600, -300, -400, 2.2);
    mountain(world, 500, 4500, -200, 200, 2);
    ceiling(world, 800, 1100, -300, -400, 4);
    ceiling(world, 2500, 3500, -600, -200, 0.5);
    mountain(world, 4700, 5200, 200, 400, 1);
    ceiling(world, 4000, 4300, -600, -200, 0.5);
    ceiling(world, 5500, 6000, -400, 0, 0.5);

    setTarget(world, 5500);

    water(world, 400);

    for (const x of [1000, 1900, 2050, 2500, 3000, 3500, 4400, 4200]) {
        rebel(world, x);
    }

    prisoner(world, 1150);
    prisoner(world, 4750);

    return promise(world)
}

smallMountainSuccession = world => {
    spawn(world, 0);
    mountain(world, 500, 1000, 0, 200, 2);
    ceiling(world, 900, 1500, -400, -500, 2);
    mountain(world, 1500, 2000, -200, 0, 1.5);
    ceiling(world, 1800, 2600, -400, -500, 2.5);
    mountain(world, 2500, 3500, -200, 200, 3);
    mountain(world, 2050, 2350, 250, 350, 1.2);
    ceiling(world, 3000, 4000, -400, -550, 4);
    ceiling(world, 3800, 4500, -300, -450, 4);

    setTarget(world, 4000);

    water(world, 400);

    for (const x of [850, 1600, 1850, 2580, 2880, 3350, 3450]) {
        rebel(world, x)
    }

    enemyChopper(world, [
        { x: 950, y: -150 },
        { x: 1250, y: -50 },
    ]);

    prisoner(world, 650);
    prisoner(world, 2150);

    return promise(world)
}

nightMountains = (world) => {
    spawn(world, 0, 0);
    mountain(world, 500, 2500, -300, 0, 1);
    ceiling(world, 2700, 3800, -400, 0, 2);
    mountain(world, 2900, 3450, 400, 300, 1);
    mountain(world, 3800, 4500, -200, 200, 1);
    ceiling(world, 4500, 5500, -600, -200, 2);

    setTarget(world, 5000);

    water(world, 400);

    enemyChopper(world, [
        { x: 2000, y: -500 },
        { x: 1200, y: -600 },
    ]);

    rebel(world, 4050);
    rebel(world, 4150);
    rebel(world, 4250);

    prisoner(world, 1750);
    prisoner(world, 3250);

    return promise(world)
};

upAndDown = (world) => {
    spawn(world, 0);
    mountain(world, 500, 1000, 0, 200, 2);
    ceiling(world, 900, 1500, -500, -300, 2);
    mountain(world, 1400, 2500, -150, 200, 2);
    ceiling(world, 2400, 3500, -400, -200, 2);
    mountain(world, 2800, 4000, -50, 200, 1.5);
    // mountain(world, 1500, 2000, -200, 0, 1.5);
    // ceiling(world, 1800, 2600, -400, -500, 2.5);
    // mountain(world, 2500, 3500, -200, 200, 3);
    // ceiling(world, 3000, 4000, -400, -550, 4);

    setTarget(world, 4500);

    water(world, 400);

    for (const x of [850, 1600, 1850, 2600, 2900, 3350, 3450, 3900]) {
        rebel(world, x)
    }

    prisoner(world, 1950);
    prisoner(world, 3550);

    return promise(world)
}

mountainChopperCeilingChopper = (world) => {
    spawn(world, 0);
    mountain(world, 500, 1000, -400, 200, 1);
    ceiling(world, 2000, 3400, -200, 150, 1);
    mountain(world, 2400, 2700, 280, 350, 0.5);
    mountain(world, 1200, 1500, 200, 250, 0.5);
    mountain(world, 3750, 4100, 300, 350, 0.5);
    ceiling(world, 4300, 4600, -300, -550, 1);

    setTarget(world, 4500);

    prisoner(world, 1450);
    prisoner(world, 3800);
    rebel(world, 750);
    rebel(world, 2450);

    enemyChopper(world, [
        { x: 1700, y: -200 },
        { x: 1500, y: 100 },
    ]);

    enemyChopper(world, [
        { x: 3800, y: -200 },
        { x: 4200, y: 200 },
    ]);

    water(world, 400);

    return promise(world);
}

tightSqueezes = (world) => {
    spawn(world, 0);

    ceiling(world, 500, 1000, 0, 150, 1);
    mountain(world, 550, 1200, 400, 550, 1);
    ceiling(world, 1200, 1700, -400, -500, 0.7);

    mountain(world, 1500, 2300, 0, 250, 0.5);
    ceiling(world, 2000, 2450, -300, -200, 1);
    ceiling(world, 2700, 3150, -50, 50, 1);

    mountain(world, 2900, 3400, 600, 550, 1.2);
    mountain(world, 3500, 4000, -200, -300, 1.2);
    ceiling(world, 3750, 4000, -500, -600, 0.8);

    setTarget(world, 4500);

    rebel(world, 950);
    rebel(world, 1550);
    rebel(world, 2250);
    rebel(world, 2200);
    rebel(world, 3000);
    rebel(world, 3850);

    prisoner(world, 1850);
    prisoner(world, 3250);

    enemyChopper(world, [
        { x: 2900, y: 150 },
        { x: 2600, y: 250 },
    ]);

    enemyChopper(world, [
        { x: 4650, y: -350 },
        { x: 4400, y: -150 },
    ]);

    water(world, 600);

    return promise(world);
};

doubleChopperNonsense = (world) => {
    spawn(world, 0);

    mountain(world, 500, 1500, -200, 0, 1);
    ceiling(world, 450, 1500, -600, -400, 1);

    enemyChopper(world, [
        { x: 1800, y: -300 },
        { x: 1800, y: 200 },
    ]);

    enemyChopper(world, [
        { x: 5150, y: -250 },
        { x: 5500, y: -350 },
    ]);

    mountain(world, 1750, 2150, 400, 300, 1);
    ceiling(world, 2650, 3400, 300, 200, 1);
    ceiling(world, 1750, 2800, -750, -450, 4);
    mountain(world, 2250, 2500, 500, 450, 0.5);
    mountain(world, 3100, 3250, 550, 560, 1);
    mountain(world, 3550, 4150, 500, 0, 1);
    ceiling(world, 3600, 4200, -300, -500, 0.8);

    ceiling(world, 4400, 5000, -400, -600, 0.8);
    mountain(world, 4400, 4950, -200, -100, 0.7);
    mountain(world, 5600, 5900, 500, 550, 0.7);

    setTarget(world, 5500);

    prisoner(world, 3150);
    prisoner(world, 4100);
    prisoner(world, 5800);

    rebel(world, 710);
    rebel(world, 1150);
    rebel(world, 1800);
    rebel(world, 2430);
    rebel(world, 3700);
    rebel(world, 3900);
    rebel(world, 4550);
    rebel(world, 4900);

    water(world, 600);

    return promise(world);
}
