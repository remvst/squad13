class Game {
    constructor() {
        this.world = new World();
    }

    cycle(elapsed) {
        this.world.cycle(elapsed);
        this.world.prepareSprites();
        this.world.render();
    }
}
