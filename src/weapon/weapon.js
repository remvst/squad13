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
            const actualAngle = angle + this.owner.aimAngle;
            this.owner.world.add(new Bullet(this.owner.x + Math.cos(actualAngle) * 15, this.owner.y + Math.sin(actualAngle) * 15, actualAngle));
        }
    }

    cycle(elapsed) {

    }
}
