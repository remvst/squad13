class Player extends Character {
    constructor() {
        super();

        this.buckets.push('player');

        // Crosshair
        this.sprite(sprite => {
            sprite.x = this.controls.aim.x;
            sprite.y = this.controls.aim.y;
            sprite.z = 0;
            sprite.character = '[';
            sprite.anchorX = 1.5;
            sprite.rotation = this.age * Math.PI;
        });
        this.sprite(sprite => {
            sprite.x = this.controls.aim.x;
            sprite.y = this.controls.aim.y;
            sprite.z = 0;
            sprite.character = '[';
            sprite.anchorX = 1.5;
            sprite.scaleX = -1;
            sprite.rotation = this.age * Math.PI;
        });
    }

    cycle(elapsed) {
        let x = 0, y = 0;

        if (DOWN[37] || DOWN[65]) x = -1;
        if (DOWN[39] || DOWN[68]) x = 1;
        if (DOWN[38] || DOWN[87]) y = -1;
        if (DOWN[40] || DOWN[83]) y = 1;

        this.controls.movement.angle = Math.atan2(y, x);
        this.controls.movement.force = x || y ? 1 : 0;

        const camera = firstItem(this.world.bucket('camera'));
        this.controls.aim.x = MOUSE.x + camera.x - CANVAS_WIDTH / 2;
        this.controls.aim.y = MOUSE.y + camera.y - CANVAS_HEIGHT / 2;
        this.controls.trigger = MOUSE.down;

        super.cycle(elapsed);
    }
}
