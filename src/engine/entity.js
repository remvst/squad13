class Entity {

    constructor() {
        this.x = this.y = this.age = this.angle = 0;
        this.buckets = [];
    }

    cycle(elapsed) {
        this.age += elapsed;
    }

    render(camera) {

    }

    destroy() {

    }

    agesBy(duration) {
        const age = this.age + duration;
        return this.world.waitFor(() => this.age > age);
    }

    removed() {
        return this.world.waitFor(() => !this.world.contains(this));
    }
}
