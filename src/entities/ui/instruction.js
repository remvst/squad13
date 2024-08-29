class Instruction extends Entity {

    constructor(instruction) {
        super();
        this.instruction = instruction;
        this.lastRenderedInstruction = null;
    }

    render(camera) {
        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#000';
        ctx.textAlign = nomangle('center');
        ctx.textBaseline = nomangle('middle');
        ctx.font = nomangle('bold 48pt Impact');

        if (this.lastRenderedInstruction !== this.instruction) {
            this.age = 0;
            this.lastRenderedInstruction = this.instruction;
        }

        ctx.globalAlpha = interpolate(0, 0.3, this.age / 0.5);
        ctx.translate(0, interpolate(-25, 0, this.age / 0.5));

        ctx.fillText(this.instruction, 0, 25);
    }
}
