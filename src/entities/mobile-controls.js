renderArrow = () => {
    ctx.beginPath();
    ctx.moveTo(MOBILE_CONTROLS_HEIGHT / 4, 0);
    ctx.lineTo(-MOBILE_CONTROLS_HEIGHT / 4, -MOBILE_CONTROLS_HEIGHT / 4);
    ctx.lineTo(-MOBILE_CONTROLS_HEIGHT / 4, MOBILE_CONTROLS_HEIGHT / 4);
    ctx.fill();
}

const controls = [
    [(player) => player.controls.left, () => {
        ctx.rotate(PI);
        renderArrow();
    }],
    [(player) => player.controls.right, () => {
        renderArrow();
    }],
    [(player) => player.controls.shoot, () => {
        ctx.rotate(-PI / 2);

        ctx.beginPath();
        ctx.arc(0, 0, MOBILE_CONTROLS_HEIGHT / 4, 0, PI * 2);
        ctx.fill();
    }],
    [(player) => player.controls.up, () => {
        ctx.rotate(-PI / 2);
        renderArrow();
    }],
];

class MobileControls extends Entity {
    render(camera) {
        const player = firstItem(this.world.bucket('player'));
        if (!player) return;

        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y + CANVAS_HEIGHT / 2 - MOBILE_CONTROLS_HEIGHT);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, MOBILE_CONTROLS_HEIGHT);

        const controlWidth = CANVAS_WIDTH / controls.length;

        for (let i = 0 ; i < controls.length ; i++) {
            const [isDown, render] = controls[i];

            ctx.wrap(() => {
                ctx.translate(i * controlWidth, 0);

                if (isDown(player)) {
                    ctx.fillStyle = 'rgba(255,255,255,0.5)';
                    ctx.fillRect(0, 0, controlWidth, MOBILE_CONTROLS_HEIGHT);
                }

                ctx.fillStyle = isDown(player) ? '#000' : '#fff';
                ctx.translate(controlWidth / 2, MOBILE_CONTROLS_HEIGHT / 2);

                render();
            });
        }
    }
}
