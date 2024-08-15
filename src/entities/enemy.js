class Enemy extends Character {

    cycle(elapsed) {
        super.cycle(elapsed);
        this.controls.movement.force = 1;

        this.controls.aim.x = this.x + cos(this.controls.movement.angle) * 100;
        this.controls.aim.y = this.y + sin(this.controls.movement.angle) * 100;
    }

    onObstacleHit() {
        this.controls.movement.angle += Math.PI + rnd(Math.PI / 2, -Math.PI / 2);
    }
}
