class Player extends Chopper {

    constructor() {
        super();
        this.buckets.push('player');
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const title = firstItem(this.world.bucket('title'));
        const hasTitle = title && title.alpha > 0.5;

        this.controls.left = (DOWN[37] || DOWN[65]) && !hasTitle;
        this.controls.right = (DOWN[39] || DOWN[68]) && !hasTitle;
        this.controls.up = (DOWN[38] || DOWN[87]) && !hasTitle;
        this.controls.down = (DOWN[40] || DOWN[83]) && !hasTitle;
        this.controls.shoot = DOWN[32] && !hasTitle;
    }
}
