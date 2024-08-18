class Obstacle extends Entity {

    constructor() {
        super();
        this.buckets = ['obstacle'];
        this.points = [];
    }

    pushAway(hitbox) {
        let i = 0;
        while (this.points[i] && this.points[i].x < hitbox.x) {
            i++;
        }

        const a = this.points[i - 1];
        const b = this.points[i];

        if (!a || !b) return;

        const length = dist(a, b);
        const angle = normalize(Math.atan2(b.y - a.y, b.x - a.x));
        const alpha = normalize(normalize(Math.atan2(hitbox.y - a.y, hitbox.x - a.x)) - angle);
        const l = Math.cos(alpha) * dist(a, hitbox);
        const h = Math.abs(Math.sin(alpha) * dist(a, hitbox));

        const ratio = l / length;

        if (h > hitbox.radius) return;

        const adjustedX = a.x + ratio * (b.x - a.x);
        const adjustedY = a.y + ratio * (b.y - a.y);

        hitbox.x = adjustedX - Math.cos(angle + PI / 2) * hitbox.radius;
        hitbox.y = adjustedY - Math.sin(angle + PI / 2) * hitbox.radius;

        return true;
    }

    render() {
        ctx.wrap(() => {
            ctx.fillStyle = '#fff';
            ctx.beginPath();

            ctx.moveTo(this.points[0].x, this.points[0].y + 100);
            for (const point of this.points) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y + 100);

            ctx.fill();
        });
    }
}
