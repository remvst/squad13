class Weapon {

    constructor(owner) {
        this.owner = owner;
        this.lastShot = 0;
        this.clipSize = 10;
        this.ammoInClip = this.clipSize;
        this.reloadEnd = 0;
        this.reloadDuration = 1;
        this.shotInterval = 0;
    }

    * angles() {
        yield 0;
    }

    setTriggerPulled(pulled) {
        this.pulledTrigger = pulled;
    }

    shoot() {
        if (this.owner.age < this.reloadEnd) return; // Reloading
        if (this.owner.age - this.lastShot < this.shotInterval) return; // Rate limiting

        this.lastShot = this.owner.age;

        this.ammoInClip--;
        if (this.ammoInClip <= 0) {
            this.reloadEnd = this.owner.age + this.reloadDuration;
        }

        for (const angle of this.angles()) {
            const actualAngle = angle + this.owner.aimAngle;
            this.owner.world.add(new Bullet(
                this.owner.x + Math.cos(actualAngle) * 15,
                this.owner.y + Math.sin(actualAngle) * 15,
                actualAngle,
                this.owner.enemyBucket,
            ));
        }
    }

    cycle(elapsed) {
        if (this.ammoInClip <= 0 && this.owner.age > this.reloadEnd) {
            this.ammoInClip = this.clipSize;
        }
    }
}
