class Character extends Entity {
    constructor() {
        super();

        this.speed = 250;
        this.lastHitObstacle = 0;

        this.controls = {
            movement: { angle: 0, force: 0, },
            aim: { x: 0, y: 0 },
            trigger: false,
        };

        this.weapon = new MachineGun(this);

        // Head
        this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.7;
            sprite.character = '.';
            sprite.scaleX = sprite.scaleY = 3;

            sprite.rotation = this.aimAngle + Math.PI / 2;
        });

        const shoulders = this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.6;
            sprite.character = 'O';
            sprite.color = '#f80';
            sprite.rotation = this.aimAngle;
        });

        const hips = this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.3;
            sprite.character = 'O';
            sprite.color = '#f80';
            sprite.scaleX = sprite.scaleY = 0.5;
            sprite.rotation = this.aimAngle;
        });

        const belly = this.sprite(sprite => {
            sprite.x = this.x;
            sprite.y = this.y;
            sprite.z = 0.45;
            sprite.character = 'O';
            sprite.color = '#f80';
            sprite.scaleX = sprite.scaleY = 0.75;
            sprite.rotation = this.aimAngle;
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
            sprite.x = this.x + Math.cos(this.aimAngle + Math.PI / 2) * 5;
            sprite.y = this.y + Math.sin(this.aimAngle + Math.PI / 2) * 5;
            sprite.z = 0.3;
            sprite.character = '.';
            sprite.color = '#f80';
            sprite.scaleX = sprite.scaleY = 0.5;
            sprite.rotation = this.aimAngle;
        });

        // Knees
        this.sprite(sprite => {
            const stride = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) * 8 : 0;
            sprite.x = this.x + Math.cos(this.aimAngle + Math.PI / 2) * 5 + Math.cos(this.aimAngle) * stride;
            sprite.y = this.y + Math.sin(this.aimAngle + Math.PI / 2) * 5 + Math.sin(this.aimAngle) * stride;
            sprite.z = 0.15;
            sprite.scaleX = sprite.scaleY = 1;
            sprite.character = '.';
            sprite.color = '#f80';
            sprite.rotation = this.aimAngle;
        });
        this.sprite(sprite => {
            const stride = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) * 8 : 0;
            sprite.x = this.x + Math.cos(this.aimAngle + Math.PI / 2) * 5 - Math.cos(this.aimAngle) * stride;
            sprite.y = this.y + Math.sin(this.aimAngle + Math.PI / 2) * 5 - Math.sin(this.aimAngle) * stride;
            sprite.z = 0.15;
            sprite.scaleX = sprite.scaleY = 1;
            sprite.character = '.';
            sprite.color = '#f80';
            sprite.rotation = this.aimAngle;
        });

        // Feet
        this.sprite(sprite => {
            const stride = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) * 10 : 0;
            sprite.x = this.x + Math.cos(this.aimAngle + Math.PI / 2) * 5 + Math.cos(this.aimAngle) * stride;
            sprite.y = this.y + Math.sin(this.aimAngle + Math.PI / 2) * 5 + Math.sin(this.aimAngle) * stride;
            sprite.z = 0;
            sprite.anchorX = 0;
            sprite.scaleX = 0.5;
            sprite.character = '-';
            sprite.color = '#f80';
            sprite.rotation = this.aimAngle;
        });
        this.sprite(sprite => {
            const stride = this.controls.movement.force ? Math.sin(this.age * Math.PI * 4) * 10 : 0;

            sprite.x = this.x - Math.cos(this.aimAngle + Math.PI / 2) * 5 - Math.cos(this.aimAngle) * stride;
            sprite.y = this.y - Math.sin(this.aimAngle + Math.PI / 2) * 5 - Math.sin(this.aimAngle) * stride;
            sprite.z = 0;
            sprite.anchorX = 0;
            sprite.scaleX = 0.5;
            sprite.character = '-';
            sprite.color = '#f80';
            sprite.rotation = this.aimAngle;
        });
    }

    get aimAngle() {
        const { aim } = this.controls;
        return Math.atan2(aim.y - this.y, aim.x - this.x);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const { movement, trigger } = this.controls;
        if (movement.force) {
            this.x += movement.force * Math.cos(movement.angle) * elapsed * this.speed;
            this.y += movement.force * Math.sin(movement.angle) * elapsed * this.speed;
        }

        this.weapon.setTriggerPulled(trigger);
        this.weapon.cycle(elapsed);

        for (const wall of this.world.bucket('wall')) {
            if (wall.pushAway(this, 15)) {
                this.onObstacleHit(wall);
            }
        }
    }

    onObstacleHit(wall) {

    }
}
