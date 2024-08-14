class Particle extends Entity {
    constructor(opts) {
        super();

        this.maxAge = opts.maxAge;

        this.sprite(sprite => {
            sprite.x = interpolate(opts.x[0], opts.x[1], this.age / opts.maxAge);
            sprite.y = interpolate(opts.y[0], opts.y[1], this.age / opts.maxAge);
            sprite.z = interpolate(opts.z[0], opts.z[1], this.age / opts.maxAge);
            sprite.alpha = interpolate(opts.alpha[0], opts.alpha[1], this.age / opts.maxAge);
            sprite.scaleX = interpolate(opts.scaleX[0], opts.scaleX[1], this.age / opts.maxAge);
            sprite.scaleY = interpolate(opts.scaleY[0], opts.scaleY[1], this.age / opts.maxAge);
            sprite.rotation = interpolate(opts.rotation[0], opts.rotation[1], this.age / opts.maxAge);
            sprite.character = opts.character;
        });
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.age >= this.maxAge) {
            this.world.remove(this);
        }
    }
}
