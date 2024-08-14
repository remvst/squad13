class MachineGun extends Weapon {

    * angles() {
        yield interpolate(-PI / 16, PI / 16, Math.random());
    }

    cycle(elapsed) {
        if (this.pulledTrigger && this.owner.age - this.lastShot > 0.1) {
            this.shoot();
        }
    }
}
