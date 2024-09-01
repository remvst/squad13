class RunRecap extends Entity {

    constructor(label, value) {
        super();
        this.label = label;
        this.value = value;
    }

    render() {
        ctx.textBaseline = nomangle('middle');
        ctx.fillStyle = '#fff';
        ctx.font = nomangle('18pt Courier');

        ctx.textAlign = nomangle('right');
        ctx.fillText(this.label, -20, 0);

        ctx.textAlign = nomangle('left');
        ctx.fillText(this.value, 20, 0);
    }
}
