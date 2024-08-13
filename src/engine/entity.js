class Entity {

    constructor() {
        this.x = this.y = this.age = 0;
        this.buckets = [];
        this.sprites = [];

        this.spriteSetups = [];
    }

    prepareSprites() {
        for (let i = 0 ; i < this.spriteSetups.length ; i++) {
            this.sprites[i].reset();
            this.spriteSetups[i](this.sprites[i]);
        }
    }

    sprite(setup) {
        const sprite = new Sprite();
        this.sprites.push(sprite);
        this.spriteSetups.push(setup);
        return sprite;
    }

    cycle(elapsed) {
        this.age += elapsed;
    }
}
