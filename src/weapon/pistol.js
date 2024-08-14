class Pistol extends Weapon {
    setTriggerPulled(pulled) {
        if (pulled && !this.pulledTrigger && this.owner.age - this.lastShot > 0.2) {
            this.shoot();
        }
        super.setTriggerPulled(pulled);
    }
}
