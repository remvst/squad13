class Player extends Chopper {

    constructor() {
        super();
        this.buckets.push('player');
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.controls.left = DOWN[37] || DOWN[65];
        this.controls.right = DOWN[39] || DOWN[68]
        this.controls.up = DOWN[38] || DOWN[87];
        this.controls.down = DOWN[40] || DOWN[83];
        this.controls.shoot = DOWN[32];
    }
}
