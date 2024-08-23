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
}
