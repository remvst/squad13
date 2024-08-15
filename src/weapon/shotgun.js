class Shotgun extends Weapon {

    constructor(owner) {
        super(owner);

        this.clipSize = 6;
        this.reloadDuration = 1.5;
        this.shotInterval = 0.4;
    }

    setTriggerPulled(pulled) {
        if (pulled && !this.pulledTrigger) {
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
