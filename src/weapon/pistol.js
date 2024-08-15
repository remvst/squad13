class Pistol extends Weapon {

    constructor(owner) {
        super(owner);

        this.clipSize = 12;
        this.reloadDuration = 1;
        this.shotInterval = 0.1;
    }

    setTriggerPulled(pulled) {
        if (pulled && !this.pulledTrigger && this.owner.age - this.lastShot > 0.2) {
            this.shoot();
        }
        super.setTriggerPulled(pulled);
    }
}
