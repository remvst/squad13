const FULL_WALL = {
    fromZ: 0,
    toZ: 1,
}

const DOOR_TOP = {
    fromZ: 0.75,
    toZ: 1,
}

const WINDOW_BOTTOM = {
    fromZ: 0,
    toZ: 0.25,
}

const WINDOW_TOP = {
    fromZ: 0.25,
    toZ: 0.75,
}

class Wall extends Entity {
    constructor(from, to, zParams) {
        super();

        this.buckets.push('wall');

        this.from = from;
        this.to = to;
        this.length = dist(from, to);
        this.angle = angleBetween(from, to);

        const shunks = this.length / 20;
        for (let z = zParams.fromZ ; z <= zParams.toZ ; z += 1 / 5) {
            for (let i = 0; i < shunks; i++) {
                const x = interpolate(from.x, to.x, i / shunks);
                const y = interpolate(from.y, to.y, i / shunks);

                this.sprite(sprite => {
                    sprite.x = x;
                    sprite.y = y;
                    sprite.z = z;
                    sprite.character = '-';
                    sprite.rotation = this.angle;
                });
            }
        }
    }
}
