class Entity {

    constructor() {
        this.x = this.y = 0;
        this.buckets = [];
        this.sprites = [];

        this.spriteSetups = [];
    }

    prepareSprites() {
        while (this.sprites.length < this.spriteSetups.length) {
            this.sprites.push(new Sprite());
        }

        for (let i = 0 ; i < this.spriteSetups.length ; i++) {
            this.spriteSetups[i](this.sprites[i]);
        }
    }

    sprite(setup) {
        this.spriteSetups.push(setup);
    }

    cycle(elapsed) {
        // TODO impl in subclass
    }

}
