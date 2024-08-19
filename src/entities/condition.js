class Condition extends Entity {
    constructor(isValid) {
        super();
        this.isValid = isValid;
    }

    promise() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        try {
            if (this.isValid()) {
                this.resolve();
            } else {
                return;
            }
        } catch (e) {
            this.reject(e);
        }

        this.world.remove(this);
    }
}
