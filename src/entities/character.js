class Character extends Entity {
    constructor() {
        super();

        this.speed = 250;

        this.controls = {
            movement: { angle: 0, force: 0, },
            aim: { x: 0, y: 0 },
            shoot: false,
        };

        // Head
        this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.7;
            sprite.character = '.';
            sprite.scaleX = sprite.scaleY = 3;

            sprite.rotation = this.controls.aim.angle + Math.PI / 2;
        });

        const shoulders = this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.6;
            sprite.character = 'O';
            sprite.color = '#f80';
            sprite.rotation = this.controls.aim.angle;
        });

        const hips = this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.3;
            sprite.character = 'O';
            sprite.color = '#f80';
            sprite.scaleX = sprite.scaleY = 0.5;
            sprite.rotation = this.controls.aim.angle;
        });

        const belly = this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.45;
            sprite.character = 'O';
            sprite.color = '#f80';
            sprite.scaleX = sprite.scaleY = 0.75;
            sprite.rotation = this.controls.aim.angle;
        });

        // Arms
        this.sprite(sprite => {
            sprite.y = -10;
            sprite.anchorY = 0;
            sprite.character = 'I';
            sprite.parent = shoulders;
            sprite.scaleY = 1.3;
            sprite.color = '#f80';``

            sprite.rotation = -Math.PI / 2 + Math.PI / 8;
        });
        this.sprite(sprite => {
            sprite.y = 10;
            sprite.anchorY = 0;
            sprite.character = 'I';
            sprite.parent = shoulders;
            sprite.scaleY = 1.3;
            sprite.color = '#f80';

            sprite.rotation = -Math.PI / 2 - Math.PI / 8;
        });

        // Hips
        this.sprite(sprite => {
            sprite.x = this.x + Math.cos(this.controls.aim.angle + Math.PI / 2) * 5;
            sprite.y = this.y + Math.sin(this.controls.aim.angle + Math.PI / 2) * 5;
            sprite.z = 0.3;
            sprite.character = '.';
            sprite.color = '#f80';
            sprite.scaleX = sprite.scaleY = 0.5;
            sprite.rotation = this.controls.aim.angle;
        });

        // Knees
        this.sprite(sprite => {
            sprite.x = this.x + Math.cos(this.controls.aim.angle + Math.PI / 2) * 5;
            sprite.y = this.y + Math.sin(this.controls.aim.angle + Math.PI / 2) * 5;
            sprite.z = 0.15;
            sprite.scaleX = sprite.scaleY = 1;
            sprite.character = '.';
            sprite.color = '#f80';
            sprite.rotation = this.controls.aim.angle;
        });
        this.sprite(sprite => {
            sprite.x = this.x - Math.cos(this.controls.aim.angle + Math.PI / 2) * 5;
            sprite.y = this.y - Math.sin(this.controls.aim.angle + Math.PI / 2) * 5;
            sprite.z = 0.15;
            sprite.scaleX = sprite.scaleY = 1;
            sprite.character = '.';
            sprite.color = '#f80';
            sprite.rotation = this.controls.aim.angle;
        });

        // Feet
        this.sprite(sprite => {
            const stride = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) * 10 : 0;
            sprite.x = this.x + Math.cos(this.controls.aim.angle + Math.PI / 2) * 5 + Math.cos(this.controls.aim.angle) * stride;
            sprite.y = this.y + Math.sin(this.controls.aim.angle + Math.PI / 2) * 5 + Math.sin(this.controls.aim.angle) * stride;
            sprite.z = 0;
            sprite.anchorX = 0;
            sprite.scaleX = 0.5;
            sprite.character = '-';
            sprite.color = '#f80';
            sprite.rotation = this.controls.aim.angle;
        });
        this.sprite(sprite => {
            const stride = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) * 10 : 0;

            sprite.x = this.x - Math.cos(this.controls.aim.angle + Math.PI / 2) * 5 - Math.cos(this.controls.aim.angle) * stride;
            sprite.y = this.y - Math.sin(this.controls.aim.angle + Math.PI / 2) * 5 - Math.sin(this.controls.aim.angle) * stride;
            sprite.z = 0;
            sprite.anchorX = 0;
            sprite.scaleX = 0.5;
            sprite.character = '-';
            sprite.color = '#f80';
            sprite.rotation = this.controls.aim.angle;
        });

        return;

        // Legs
        this.sprite(sprite => {
            sprite.y = -5;
            sprite.anchorY = 0;
            sprite.character = 'I';
            sprite.parent = hips;
            sprite.scaleY = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) : 0.2;
            sprite.color = '#f80';

            sprite.rotation = -Math.PI / 2;
        });
        this.sprite(sprite => {
            sprite.y = 5;
            sprite.anchorY = 0;
            sprite.character = 'I';
            sprite.parent = hips;
            sprite.scaleY = this.controls.movement.force ? -Math.sin(this.age * Math.PI * 4) : 0.2;
            sprite.color = '#f80';

            sprite.rotation = -Math.PI / 2;
        });
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const { movement, aim, shoot } = this.controls;
        if (movement.force) {
            this.x += movement.force * Math.cos(movement.angle) * elapsed * this.speed;
            this.y += movement.force * Math.sin(movement.angle) * elapsed * this.speed;
        }

        // TODO angle at mouse

        this.controls.aim.angle = Math.atan2(aim.y - this.y, aim.x - this.x);

        for (const wall of this.world.bucket('wall')) {
            wall.pushAway(this, 15);
        }
    }
}
