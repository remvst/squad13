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

        this.zParams = zParams;

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
                    sprite.color = '#00f';
                });
            }
        }
    }

    pushAway(entity, radius) {
        if (this.zParams.fromZ >= 0.75) return;

        const minX = Math.min(this.from.x, this.to.x) - radius;
        const maxX = Math.max(this.from.x, this.to.x) + radius;
        const minY = Math.min(this.from.y, this.to.y) - radius;
        const maxY = Math.max(this.from.y, this.to.y) + radius;

        if (!isBetween(minX, entity.x, maxX) || !isBetween(minY, entity.y, maxY)) return;

        const readjustedX = Math.abs(entity.x - minX) < Math.abs(entity.x - maxX) ? minX - 1 : maxX + 1;
        const readjustedY = Math.abs(entity.y - minY) < Math.abs(entity.y - maxY) ? minY - 1 : maxY + 1;

        if (Math.abs(readjustedX - entity.x) < Math.abs(readjustedY - entity.y)) {
            entity.x = readjustedX;
        } else {
            entity.y = readjustedY;
        }
    }
}
