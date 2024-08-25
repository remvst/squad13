class RNG {
    constructor() {
        this.index = 0;
        this.elements = [];
    }

    next(min = 0, max = 1) {
        if (this.index >= this.elements.length) {
            this.elements.push(random());
        }
        return this.elements[this.index++ % this.elements.length] * (max - min) + min;
    }

    reset() {
        this.index = 0;
    }
}
