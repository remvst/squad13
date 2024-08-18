class Obstacle extends Entity {

    constructor() {
        super();
        this.points = [];
    }

    render() {
        ctx.wrap(() => {
            ctx.fillStyle = '#fff';
            ctx.beginPath();

            for (const point of this.points) {
                ctx.lineTo(point.x, point.y);
            }

            ctx.fill();
        });
    }
}
