class Obstacle extends Entity {

    constructor() {
        super();
        this.buckets = ['obstacle'];
        this.points = [];
        this.directionY = 1;
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

        hitbox.x = adjustedX - this.directionY * Math.cos(angle + PI / 2) * hitbox.radius;
        hitbox.y = adjustedY - this.directionY * Math.sin(angle + PI / 2) * hitbox.radius;

        return true;
    }

    render() {
        ctx.wrap(() => {
            ctx.fillStyle = '#000';
            ctx.beginPath();

            let maxY = this.points[0].y;
            let minY = maxY;
            for (const point of this.points) {
                ctx.lineTo(point.x, point.y);
                maxY = max(maxY, point.y + 100);
                minY = min(minY, point.y - 100);
            }

            if (this.directionY > 0) {
                ctx.lineTo(this.points[this.points.length - 1].x, maxY);
                ctx.lineTo(this.points[0].x, maxY);
            } else {
                ctx.lineTo(this.points[this.points.length - 1].x, minY);
                ctx.lineTo(this.points[0].x, minY);
            }

            ctx.fill();
        });
    }
}
