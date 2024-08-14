class Floor extends Entity {
    constructor() {
        super();

        const CELL_SIZE = 50;
        for (let row = 0 ; row < CANVAS_HEIGHT / CELL_SIZE + 2 ; row++) {
            for (let col = 0 ; col < CANVAS_WIDTH / CELL_SIZE + 2 ; col++) {
                this.sprite(sprite => {
                    const camera = firstItem(this.world.bucket('camera'));
                    sprite.x = col * CELL_SIZE + camera.x - CANVAS_WIDTH / 2 - (camera.x % CELL_SIZE);
                    sprite.y = row * CELL_SIZE + camera.y - CANVAS_HEIGHT / 2 - (camera.y % CELL_SIZE);
                    sprite.z = 0;
                    sprite.alpha = 0.1;
                    sprite.character = '.';
                });
            }
        }

    }
}
