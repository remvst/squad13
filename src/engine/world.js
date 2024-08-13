class World {
    constructor() {
        this.entities = new Set();
        this.buckets = new Map();
        this.sprites = [];
    }

    bucket(bucket) {
        if (!this.buckets.has(bucket)) {
            this.buckets.set(bucket, new Set());
        }
        return this.buckets.get(bucket);
    }

    add(entity) {
        this.entities.add(entity);
        for (const bucket of entity.buckets)  {
            this.bucket(bucket).add(entity);
        }
    }

    remove() {
        this.entities.delete(entity);
        for (const bucket of entity.buckets)  {
            this.bucket(bucket).delete(entity);
        }
        for (const sprite of entity.sprites) {
            const index = this.sprites.indexOf(sprite);
            if (index >= 0) this.sprites.splice(index, 1);
        }
    }

    cycle(elapsed) {
        for (const entity of this.entities) {
            entity.cycle(elapsed);
        }
    }

    prepareSprites() {
        for (const entity of this.entities) {
            entity.prepareSprites();
        }

        this.sprites.sort((a, b) => a.z - b.z);
    }

    render() {
        for (const sprite of this.sprites) {
            sprite.render();
        }
    }
}
