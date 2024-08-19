sunset = () => new Background('#f22f00', '#fa7f02');

function tutorialFly(world) {
    const camera = firstItem(world.bucket('camera'));
    camera.minX = -300;
    camera.maxX = 5000;
    camera.minY = -500;
    camera.maxY = 500;

    world.add(sunset());

    world.add(Obstacle.landingObstacle(0, 100, 200));
    world.add(Obstacle.landingObstacle(1000, 100, 200));

    world.add(new Player());
    world.add(new Water(400));
}
