class Particle extends Entity {

    constructor(
        color,
        valuesSize,
        valuesX,
        valuesY,
        duration,
    ) {
        super();
        this.color = color;
        this.valuesSize = valuesSize;
        this.valuesX = valuesX;
        this.valuesY = valuesY;
        this.duration = duration;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > this.duration) {
            this.world.remove(this);
        }
    }

    interp(property) {
        const progress = this.age / this.duration;
        return property[0] + progress * (property[1] - property[0]);
    }

    render() {
        const size = this.interp(this.valuesSize);
        ctx.translate(this.interp(this.valuesX), this.interp(this.valuesY));
        ctx.rotate(PI / 4);

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.interp([1, 0]);
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }
}
