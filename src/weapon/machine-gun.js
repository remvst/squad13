class MachineGun extends Weapon {

    constructor(owner) {
        super(owner);

        this.clipSize = 15;
        this.reloadDuration = 1.5;
    }

    * angles() {
        yield interpolate(-PI / 32, PI / 32, Math.random());
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.pulledTrigger && this.owner.age - this.lastShot > 0.1) {
            this.shoot();
        }
    }
}
