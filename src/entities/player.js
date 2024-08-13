class Player extends Character {
    cycle(elapsed) {
        let x = 0, y = 0;

        if (DOWN[37] || DOWN[65]) x = -1;
        if (DOWN[39] || DOWN[68]) x = 1;
        if (DOWN[38] || DOWN[87]) y = -1;
        if (DOWN[40] || DOWN[83]) y = 1;

        this.controls.movement.angle = Math.atan2(y, x);
        this.controls.movement.force = x || y ? 1 : 0;

        super.cycle(elapsed);
    }
}
