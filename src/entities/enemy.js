class Enemy extends Character {

    constructor() {
        super();
        this.buckets.push('enemy');
        this.speed = 100;
        this.lastSpottedPlayerCheck = 0;
        this.lastSpottedPlayer = 0;
        this.age = random() * 100;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const player = firstItem(this.world.bucket('player'));
        if (this.age - this.lastSpottedPlayerCheck > 1) {
            if (player && this.canSee(player)) {
                this.controls.movement.angle += Math.PI + rnd(Math.PI / 2, -Math.PI / 2);
                this.lastSpottedPlayer = this.age;
            }

            this.lastSpottedPlayerCheck = this.age;
        }

        if (this.age - this.lastSpottedPlayer > 2) {
            this.speed = 100;

            this.controls.movement.force = 1;
            this.controls.aim.x = this.x + cos(this.controls.movement.angle) * 100;
            this.controls.aim.y = this.y + sin(this.controls.movement.angle) * 100;

            this.controls.trigger = false;
        } else {
            this.controls.movement.force = (this.age / 1) % 1 > 0.5 ? 1 : 0;

            // Become faster
            this.speed = 200;

            // Aim at the player
            this.controls.aim.x += between(-elapsed * 200, player.x - this.controls.aim.x, elapsed * 200);
            this.controls.aim.y += between(-elapsed * 200, player.y - this.controls.aim.y, elapsed * 200);

            this.controls.trigger = !this.controls.trigger;
        }
    }

    onObstacleHit() {
        this.controls.movement.angle += Math.PI + rnd(Math.PI / 2, -Math.PI / 2);
    }
}
