class Character extends Entity {
    constructor() {
        super();

        // Head
        this.sprite(sprite => {
            // console.log(this.x);
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.9;
        });
    }
}
