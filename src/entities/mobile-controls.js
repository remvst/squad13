mobileControlsHeight = () => max(CANVAS_HEIGHT * 0.1, 150);

renderArrow = () => {
    ctx.beginPath();
    ctx.moveTo(mobileControlsHeight() / 4, 0);
    ctx.lineTo(-mobileControlsHeight() / 4, -mobileControlsHeight() / 4);
    ctx.lineTo(-mobileControlsHeight() / 4, mobileControlsHeight() / 4);
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
        ctx.arc(0, 0, mobileControlsHeight() / 4, 0, PI * 2);
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

        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y + CANVAS_HEIGHT / 2 - mobileControlsHeight());

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, mobileControlsHeight());

        const controlWidth = CANVAS_WIDTH / controls.length;

        for (let i = 0 ; i < controls.length ; i++) {
            const [isDown, render] = controls[i];

            ctx.wrap(() => {
                ctx.translate(i * controlWidth, 0);

                if (isDown(player)) {
                    ctx.fillStyle = 'rgba(255,255,255,0.5)';
                    ctx.fillRect(0, 0, controlWidth, mobileControlsHeight());
                }

                ctx.fillStyle = isDown(player) ? '#000' : '#fff';
                ctx.translate(controlWidth / 2, mobileControlsHeight() / 2);

                render();
            });
        }
    }
}
