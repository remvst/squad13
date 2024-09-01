class StartPrompt extends Entity {
    constructor(text, keyCodes, onKeyDown) {
        super();
        this.text = text;
        this.keyCodes = keyCodes;
        this.onKeyDown = onKeyDown;
        this.released = false;
        this.buckets.push('start-prompt');
    }

    render(camera) {
        if (this.age / 2 % 1 < 0.2) return;
        ctx.font = nomangle('18pt Courier');
        ctx.textAlign = nomangle('center');
        ctx.textBaseline = nomangle('middle');
        ctx.fillStyle = '#fff';
        ctx.fillText(this.text, 0, 0);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        let released = true;
        for (const keyCode of this.keyCodes) {
            let isDown = DOWN[keyCode];

            if (keyCode === 32) isDown = isDown || TOUCHES.length > 0;

            released = released && !isDown;

            if (isDown && this.released) {
                sound(...[2,,409,,.02,.02,1,.5,-2,,-316,.05,,,137,,.43,.82,.02]); // Blip 189
                this.released = false;
                this.onKeyDown();
            }
        }
        this.released = released;
    }
}
