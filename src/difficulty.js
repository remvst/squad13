DIFFICULTY_SETTINGS = [
    DIFFICULTY_EASY = [
        nomangle('EASY'),
        true, // simplifiedPhysics
        0.5, // uncontrollableDuration
        0.5, // playerShotInterval
        0.5, // playerLockDuration
        6, // rebelShotInterval
        6, // chopperShotInterval
    ],
    DIFFICULTY_NORMAL = [
        nomangle('NORMAL'),
        false, // simplifiedPhysics
        1, // uncontrollableDuration
        1, // playerShotInterval
        1, // playerLockDuration
        4, // rebelShotInterval
        3, // chopperShotInterval
    ],
    DIFFICULTY_HARD = [
        nomangle('HARD'),
        false, // simplifiedPhysics
        3, // uncontrollableDuration
        999, // playerShotInterval
        1, // playerLockDuration
        4, // rebelShotInterval
        3, // chopperShotInterval
    ],
];

applyDifficulty = (world, [label, simplifiedPhysics, uncontrollableDuration, playerShotInterval, playerLockDuration, rebelShotInterval, chopperShotInterval]) => {
    if (DEBUG) {
        console.log('Applying difficulty', {
            label, simplifiedPhysics, uncontrollableDuration, playerShotInterval, playerLockDuration, rebelShotInterval, chopperShotInterval
        })
    }

    const player = firstItem(world.bucket('player'));
    if (player) {
        player.simplifiedPhysics = simplifiedPhysics;
        player.uncontrollableDuration = uncontrollableDuration;
        player.shotInterval = playerShotInterval;
        player.lockDuration = playerLockDuration;
    }

    for (const rebel of world.bucket('rebel')) {
        rebel.shotInterval = rebelShotInterval;
    }

    for (const chopper of world.bucket('enemy-chopper')) {
        chopper.shotInterval = chopperShotInterval;
    }
}
