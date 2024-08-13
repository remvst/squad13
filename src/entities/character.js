class Character extends Entity {
    constructor() {
        super();

        this.speed = 100;

        this.controls = {
            movement: { angle: 0, force: 0, },
            aim: { x: 0, y: 0 },
            shoot: false,
        };

        // Head
        this.sprite(sprite => {
            // console.log(this.x);
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.9;

            sprite.rotation = this.controls.aim.angle;
        });

        // Hips
        this.sprite(sprite => {
            // console.log(this.x);
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.5;

            sprite.rotation = this.controls.aim.angle;
        });
    }

    cycle(elapsed) {
        const { movement, aim, shoot } = this.controls;
        if (movement.force) {
            this.x += movement.force * Math.cos(movement.angle) * elapsed * this.speed;
            this.y += movement.force * Math.sin(movement.angle) * elapsed * this.speed;
        }

        // TODO angle at mouse

        this.controls.aim.angle = Math.atan2(aim.y - this.y, aim.x - this.x);
    }
}
