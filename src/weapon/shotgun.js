class Shotgun extends Weapon {
    setTriggerPulled(pulled) {
        if (pulled && !this.pulledTrigger && this.owner.age - this.lastShot > 0.4) {
            this.shoot();
        }
        super.setTriggerPulled(pulled);
    }

    * angles() {
        for (let i = 0 ; i < 8 ; i++) {
            yield interpolate(-1, 1, i / 4) * Math.PI / 8;
        }
    }
}
