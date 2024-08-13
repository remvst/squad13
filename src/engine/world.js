class World {
    constructor() {
        this.entities = new Set();
        this.buckets = new Map();
        this.sprites = [];

        this.add(new Camera());
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
        entity.world = this;

        entity.prepareSprites();
        for (const sprite of entity.sprites) {
            this.sprites.push(sprite);
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

        this.sprites.sort((a, b) => a.actualZ - b.actualZ);
    }

    render() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const camera = firstItem(this.bucket('camera'));
        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        for (const sprite of this.sprites) {
            sprite.render(camera);
        }

        ctx.restore();
    }
}
