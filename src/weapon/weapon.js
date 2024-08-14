class Weapon {

    constructor(owner) {
        this.owner = owner;
        this.lastShot = 0;
    }

    * angles() {
        yield 0;
    }

    setTriggerPulled(pulled) {
        this.pulledTrigger = pulled;
    }

    shoot() {
        this.lastShot = this.owner.age;
        for (const angle of this.angles()) {
            this.owner.world.add(new Bullet(this.owner.x, this.owner.y, angle + this.owner.aimAngle));
        }
    }

    cycle(elapsed) {

    }
}
