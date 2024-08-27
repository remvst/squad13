class StartPrompt extends Entity {
    constructor(text) {
        super();
        this.text = text;
        this.buckets.push('start-prompt');
    }

    render(camera) {
        if (this.age / 2 % 1 < 0.2) return;
        ctx.translate(camera.x, camera.y + CANVAS_HEIGHT / 5);
        ctx.font = '18pt Courier';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.text, 0, 0);
        ctx.fillText('DIFFICULTY: ' + (G.easyMode ? 'EASY' : 'NORMAL') + ' - PRESS [K] TO CHANGE', 0, 50);
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (DOWN[32]) {
            this.world.remove(this);
            sound(...[2,,409,,.02,.02,1,.5,-2,,-316,.05,,,137,,.43,.82,.02]); // Blip 189
        }
    }
}
