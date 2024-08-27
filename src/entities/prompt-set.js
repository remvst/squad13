class PromptSet extends Entity {
    constructor(prompts) {
        super();
        this.prompts = prompts;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        for (const prompt of this.prompts) {
            prompt.cycle(elapsed);
        }
    }

    render(camera) {
        ctx.translate(camera.x, camera.y + CANVAS_HEIGHT / 5);

        for (const prompt of this.prompts) {
            prompt.render(camera);
            ctx.translate(0, 50);
        }
    }
}
