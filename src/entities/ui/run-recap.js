class RunRecap extends Entity {

    constructor(label, value) {
        super();
        this.label = label;
        this.value = value;
    }

    render(camera) {
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.font = '18pt Courier';

        ctx.textAlign = 'right';
        ctx.fillText(this.label, -20, 0);

        ctx.textAlign = 'left';
        ctx.fillText(this.value, 20, 0);
    }
}
