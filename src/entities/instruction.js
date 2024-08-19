class Instruction extends Entity {

    constructor(instruction) {
        super();
        this.instruction = instruction;
    }

    render(camera) {
        ctx.translate(this.x, this.y);

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 48pt Impact';
        ctx.fillText(this.instruction, 0, 25);
    }
}
