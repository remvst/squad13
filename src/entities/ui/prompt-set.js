class PromptSet extends Entity {
    constructor(prompts) {
        super();
        this.prompts = prompts.filter(x => x);
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        for (const prompt of this.prompts) {
            prompt.cycle(elapsed);
        }
    }

    render(camera) {
        ctx.translate(camera.x, camera.y + 100);

        if (inputMode === INPUT_MODE_TOUCH) {
            ctx.scale(2, 2);
        }

        for (const prompt of this.prompts) {
            prompt.render(camera);
            ctx.translate(0, 50);
        }
    }
}
