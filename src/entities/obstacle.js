class Obstacle extends Entity {

    constructor() {
        super();
        this.buckets = ['obstacle'];
        this.points = [];
        this.directionY = 1;
    }

    get minX() { return this.points[0].x; }
    get maxX() { return this.points[this.points.length - 1].x; }

    static landingObstacle(x, y, length) {
        const obstacle = new Obstacle();
        obstacle.points = [
            {x: x - length, y: y + 400},
            {x: x - length / 2 - 50, y: y - 10},
            {x: x - length / 2, y},
            {x: x + length / 2, y},
            {x: x + length / 2 + 50, y: y - 10},
            {x: x + length, y: y + 400},
        ];
        return obstacle;
    }

    static mountain(startX, endX, minY, maxY, periodCount = 1) {
        const length = endX - startX;
        const amplitude = maxY - minY;

        const obstacle = new Obstacle();
        obstacle.points.push({ x: startX - 100, y: maxY + amplitude });
        for (let x = startX ; x <= endX ; x += 100)  {
            obstacle.points.push({
                x: x,
                y: minY + amplitude / 2
                    + sin(x / length * PI * 2 * periodCount) * amplitude / 2
                    + sin(x / length * PI * 2 * periodCount * 4) * amplitude / 4,
            });
        }
        obstacle.points.push({ x: endX + 100, y: maxY + amplitude });
        return obstacle;
    }

    static ceiling(startX, endX, minY, maxY, periodCount = 1) {
        const length = endX - startX;
        const amplitude = maxY - minY;

        const obstacle = new Obstacle();
        obstacle.points.push({ x: startX - 100, y: maxY - amplitude });
        for (let x = startX ; x <= endX ; x += 100)  {
            obstacle.points.push({
                x: x,
                y: minY + amplitude / 2
                    + sin(x / length * PI * 2 * periodCount) * amplitude / 2
                    + sin(x / length * PI * 2 * periodCount * 4) * amplitude / 4,
            });
        }
        obstacle.points.push({ x: endX + 100, y: maxY - amplitude });
        obstacle.directionY = -1;
        return obstacle;
    }

    pushVertically(hitbox) {
        let i = 0;
        while (this.points[i] && this.points[i].x < hitbox.x) {
            i++;
        }

        const a = this.points[i - 1];
        const b = this.points[i];

        if (!a || !b) return;

        const ratio = (hitbox.x - a.x) / (b.x - a.x);

        const idealY = interpolate(a.y, b.y, ratio) - this.directionY * hitbox.radius;
        if (!isBetween(idealY, hitbox.y, idealY + this.directionY * 100)) return;

        hitbox.y = idealY;

        return true;
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
        if (!isBetween(0, ratio, 1) && dist(a, hitbox) > hitbox.radius && dist(b, hitbox) > hitbox.radius) return;

        const adjustedX = a.x + ratio * (b.x - a.x);
        const adjustedY = a.y + ratio * (b.y - a.y);

        hitbox.x = adjustedX - this.directionY * Math.cos(angle + PI / 2) * hitbox.radius;
        hitbox.y = adjustedY - this.directionY * Math.sin(angle + PI / 2) * hitbox.radius;

        return true;
    }

    render(camera) {
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
                ctx.lineTo(this.points[this.points.length - 1].x, camera.maxY);
                ctx.lineTo(this.points[0].x, camera.maxY);
            } else {
                ctx.lineTo(this.points[this.points.length - 1].x, camera.minY);
                ctx.lineTo(this.points[0].x, camera.minY);
            }

            ctx.fill();
        });

        ctx.fillStyle = '#f00';
        ctx.fillRect(this.minX, 0, 2, 400);
        ctx.fillRect(this.maxX, 0, 2, 400);
    }
}
