class Chopper extends Entity {

    constructor() {
        super();
        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false,
        };
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.fillStyle = '#f00';
            ctx.fillRect(-20, -10, 40, 20);
        });
    }
}
