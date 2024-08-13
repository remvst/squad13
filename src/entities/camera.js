class Camera extends Entity {

    constructor() {
        super();
        this.zoom = 1;
        this.buckets = ['camera'];
    }

    cycle(elapsed) {
        // TODO follow player
    }
}
